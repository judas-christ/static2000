//pug adapter for static2000
'use strict';

var pug = require('pug');

function renamePlugins(source, options) {
    options.plugins2000 = options.plugins
    delete options.plugins
    return source.replace(/plugins\./g, 'plugins2000');
}

module.exports = {
    templateExtension: '.pug',
    templateGlob: '*.pug',
    globalsInclude: 'include ./includes/globals.pug\n',
    compile: function(source, options) {
        // pug requires extends to come first
        source = source.replace(new RegExp(this.globalsInclude + '(extends [^\\n]+\n)'), `$1${this.globalsInclude}`);
        source = renamePlugins(source, options)
        var pugOptions = {
            filename: options.filename,
            pretty: true
        };
        return pug.compile(source, pugOptions);
    },
    render: function(source, options) {
        source = renamePlugins(source, options)
        return pug.render(source, options);
    }
};
