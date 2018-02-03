var fs = require('vinyl-fs');
var es = require('event-stream');
var path = require('path');

module.exports = function(state) {
  return function(options, onError) {
    return fs
      .src(options.templateAdapter.templateGlob, {
        cwd: options.templates
      })
      .pipe(
        es.map(function(file, cb) {
          var name = path.basename(file.path, path.extname(file.path));
          var fileContents = String(file.contents);
          fileContents = options.templateAdapter.globalsInclude + fileContents;

          var template = options.templateAdapter.compile(fileContents, {
            filename: file.path
          });

          state.templatesMap[name] = template;

          cb(null, file);
        })
      )
      .on('error', onError);
  };
};
