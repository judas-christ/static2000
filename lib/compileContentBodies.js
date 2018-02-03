var es = require('event-stream');
var _ = require('lodash');
var path = require('path');

//local imports
var globalFunctions = require('./globalFunctions');

module.exports = function(state) {
  return function(options, onError) {
    var _globalFunctions = globalFunctions(options, state);

    return es
      .readArray(state.contentList)
      .pipe(
        es.map(function(content, cb) {
          state.model = content;

          //create a locals object that contains the content so that we can call the functions on the content object, and also add global functions later if we want
          var locals = _.assign({}, _globalFunctions, options.globalFunctions, {
            filename: path.join(options.templates, 't'), //fake filename so includes are available
            model: content
          });

          locals._plugins = locals.plugins;
          delete locals.plugins;

          var contentBody =
            options.templateAdapter.globalsInclude + content._body;
          var htmlBody = options.templateAdapter.render(contentBody, locals);

          content.body = htmlBody;

          state.model = undefined;

          cb(null, content);
        })
      )
      .on('error', onError);
  };
};
