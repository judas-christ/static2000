//nunjucks adapter for static2000
'use strict';

var nunjucks = require('nunjucks');
var path = require('path');

function createEnvironment(templatesPath) {
  return nunjucks.configure(templatesPath, {
    watch: false
  });
}

module.exports = {
  templateExtension: '.html',
  templateGlob: '*.html',
  globalsInclude: '{% import "./includes/globals.html" as globals %}\n',
  compile: function(source, options) {
    var templatesPath = path.dirname(options.filename);
    var compiled = nunjucks.compile(source, createEnvironment(templatesPath), options.filename);
    return function(options) {
      return compiled.render(options);
    };
  },
  render: function(source, options) {
    var templatesPath = path.dirname(options.filename);
    return nunjucks.compile(source, createEnvironment(templatesPath), options.filename).render(options);
  }
};
