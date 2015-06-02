'use strict';

var fs = require('vinyl-fs');
var es = require('event-stream');
var path = require('path');
var fm = require('front-matter');

//local
var contentModelFactory = require('./ContentModel');
var parsePath = require('./parsePath');
var plugins = require('./loadPlugins');

module.exports = function(state) {
  var ContentModel = contentModelFactory(state);
  return function(options, onError) {

    var modelPlugins = plugins({
      pattern: 'static2000-model-*',
      replaceString: /^static2000-model-/,
      apply: false
    });
    for (var pluginName in modelPlugins) {
      if (pluginName in ContentModel.prototype) {
        //todo: warn that plugin is overwriting existing property and will not be added
        continue;
      }
      if (modelPlugins.hasOwnProperty(pluginName)) {
        /* jshint -W083 */
        Object.defineProperty(ContentModel.prototype, pluginName, {
          get: function() {
            var model = this;
            return modelPlugins[pluginName].call(model, options, state.contentList);
          },
          enumerable: true,
          configurable: false
        });
        /* jshint +W083 */
      }
    }

    return fs.src(path.join('**', options.templateAdapter.templateGlob), {
        cwd: options.content
      }).pipe(es.map(function(file, cb) {

        var frontMatter = fm(String(file.contents));
        var relativePath = path.relative(file.cwd, file.path);
        var parsedPath = parsePath(relativePath, options.templateAdapter.templateExtension);

        var contentOptions = {
          path: parsedPath.path,
          order: parsedPath.order,
          hidden: false,
          modified: file.stat.mtime,
          _body: frontMatter.body
        };
        //copy attributes
        for (var key in frontMatter.attributes) {
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
