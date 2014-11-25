'use strict';

var fs = require('vinyl-fs');
var File = require('vinyl');
var es = require('event-stream');
var jade = require('jade');
var path = require('path');
var _ = require('lodash');

//local
var filterContentList  = require('./filterContentList');

module.exports = function(state) {
    return function(options, onError) {
        // console.log('buildPages', options);
        var globalFunctions = {
            getByPath: function(path) {
                return state.contentMap[path];
            },
            query: function(q) {
                return filterContentList(state.contentList, q);
            },
            '_': _ //expose lodash for use in templates
        };
        return es.readArray(state.contentList)
            .pipe(es.map(function(content, cb) {

                state.model = content;

                var template = state.templatesMap[content.template];
                if(!template) {
                    cb(new Error('No template found named "' + String(content.template) + '" for content "' + content.path + '"'));
                    return;
                }
                //create a locals object that contains the content so that we can call the functions on the content object, and also add global functions later if we want
                var locals = _.assign({}, globalFunctions, options.globalFunctions, {
                    filename: path.join(options.templates, 't'), //fake filename so includes are available
                    model: content
                });
                var contentBody = 'include ./includes/globals.jade\n' + content._body;
                var htmlBody = jade.render(contentBody, locals);

                content.body = htmlBody;
                locals = _.assign({}, globalFunctions, options.globalFunctions, {
                    model: content
                });
                var html = template(locals);

                var filePath = content.path.substring(1);
                var fileOptions = {
                    path: path.join(filePath, 'index.html'),
                    contents: new Buffer(html)
                };
                var file = new File(fileOptions);

                state.model = undefined;

                cb(null, file);
            }))
            .on('error', onError)
            .pipe(fs.dest(options.dest));
    };
};
