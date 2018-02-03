var File = require('vinyl');
var es = require('event-stream');
var path = require('path');
var _ = require('lodash');

//local
var globalFunctions = require('./globalFunctions');

module.exports = function(state) {
  return function(options, onError) {
    var _globalFunctions = globalFunctions(options, state);

    return es
      .readArray(state.contentList)
      .pipe(
        es.map(function(content, cb) {
          state.model = content;

          var template = state.templatesMap[content.template];
          if (!template) {
            cb(
              new Error(
                'No template found named "' +
                  String(content.template) +
                  '" for content "' +
                  content.path +
                  '"'
              )
            );
            return;
          }

          var locals = _.assign({}, _globalFunctions, options.globalFunctions, {
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
        })
      )
      .on('error', onError);
  };
};
