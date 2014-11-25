'use strict';

var fs = require('vinyl-fs');
var es = require('event-stream');
var path = require('path');
var fm = require('front-matter');

//local
var contentModelFactory = require('./ContentModel');

var parsePath = function(relativePath, ext) {
    var orderAndNameRegex = /^(?:(\d+)-)?(.+)$/;

    var dirnames = path.dirname(relativePath).split(path.sep);
    var basenames = path.basename(relativePath, ext).split('.');
    var basename = basenames.pop();
    dirnames = dirnames.filter(function(v) { return v !== '.'; }).concat(basenames.map(function(v) { return orderAndNameRegex.exec(v)[2]; }));

    var orderAndName = orderAndNameRegex.exec(basename);
    var order = Number(orderAndName[1]);
    var filename = orderAndName[2];

    var dirname = filename === 'index'
        ? ''
        : filename;

    var url = ('/' + path.join(dirnames.join(path.sep), dirname).replace(/\./, '').replace(/\\/g, '/') + '/').replace(/\/\/+/g, '/');

    return {
        order: order,
        path: url
    };
};

module.exports = function(state) {
    var ContentModel = contentModelFactory(state);
    return function(options, onError) {
        return fs.src(path.join('**','*.jade'), {cwd: options.content})
            .pipe(es.map(function(file, cb) {

                var frontMatter = fm(String(file.contents));
                var relativePath = path.relative(file.cwd, file.path);
                var parsedPath = parsePath(relativePath, '.jade');

                var contentOptions = {
                    path: parsedPath.path,
                    order: parsedPath.order,
                    hidden: false,
                    modified: file.stat.mtime,
                    _body: frontMatter.body
                };
                //copy attributes
                for(var key in frontMatter.attributes) {
                    contentOptions[key] = frontMatter.attributes[key];
                }

                var contentObject = new ContentModel(contentOptions);

                state.contentMap[parsedPath.path] = contentObject;
                state.contentList.push(contentObject);

                cb(null, contentObject);
            }))
            .on('error', onError);
    };
};
