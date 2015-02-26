//nunjucks adapter for static2000
'use strict';

var nunjucks = require('nunjucks');
var path = require('path');

module.exports = {
    templateExtension: '.html',
    templateGlob: '*.html',
    globalsInclude: '{% import "./includes/globals.html" as globals %}\n',
    compile: function(source, options) {
        var templatesPath = path.dirname(options.filename);
        var compiled = nunjucks.compile(source, new nunjucks.Environment([new nunjucks.FileSystemLoader(templatesPath)]), options.filename);
        return function(options) {
            return compiled.render(options);
        };
    },
    render: function(source, options) {
        var templatesPath = path.dirname(options.filename);
        return nunjucks.compile(source, new nunjucks.Environment([new nunjucks.FileSystemLoader(templatesPath)]), options.filename).render(options);
    }
};
