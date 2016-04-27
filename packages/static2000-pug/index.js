//pug adapter for static2000
'use strict';

var pug = require('pug');

module.exports = {
    templateExtension: '.pug',
    templateGlob: '*.pug',
    globalsInclude: 'include ./includes/globals.pug\n',
    compile: function(source, options) {
        // pug requires extends to come first
        source = source.replace(new RegExp(this.globalsInclude + '(extend [^\\n]+\n)'), `$1${this.globalsInclude}`);
        var pugOptions = {
            filename: options.filename,
            pretty: true
        };
        return pug.compile(source, pugOptions);
    },
    render: function(source, options) {
        return pug.render(source, options);
    }
};
