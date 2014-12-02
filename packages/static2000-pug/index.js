//jade adapter for static2000
'use strict';

var jade = require('jade');

module.exports = {
    templateExtension: '.jade',
    templateGlob: '*.jade',
    globalsInclude: 'include ./includes/globals.jade\n',
    compile: function(source, options) {
        var jadeOptions = {
            filename: options.filename,
            pretty: true
        };
        return jade.compile(source, jadeOptions);
    },
    render: function(source, options) {
        return jade.render(source, options);
    }
};
