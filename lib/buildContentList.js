'use strict';

var fs = require('vinyl-fs');
var es = require('event-stream');
var path = require('path');
var fm = require('front-matter');

//local
var contentModelFactory = require('./ContentModel');
var parsePath = require('./parsePath');

module.exports = function(state) {
    var ContentModel = contentModelFactory(state);
    return function(options, onError) {

        var templateAdapter = require(options.templateAdapter);

        return fs.src(path.join('**', templateAdapter.templateGlob), {cwd: options.content})
            .pipe(es.map(function(file, cb) {

                var frontMatter = fm(String(file.contents));
                var relativePath = path.relative(file.cwd, file.path);
                var parsedPath = parsePath(relativePath, templateAdapter.templateExtension);

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
