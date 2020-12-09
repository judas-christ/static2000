var es = require('event-stream');

//local
var findParent = require('./findParent');

module.exports = function(state) {
  return function(options, onError) {
    return es
      .readArray(state.contentList)
      .pipe(
        es.map(function(content, cb) {
          var isRoot = false;
          var parent;

          if (content.path === '/') {
            isRoot = true;
          } else {
            parent = findParent(state.contentMap, content.path);
          }

          if (isNaN(content.order)) {
            content.order = parent ? parent._children.length : 0;
          }

          if (parent) {
            content._parent = parent;
            parent._children.push(content);
            parent._children.sort(function(a, b) {
              return a.order - b.order;
            });
          }

          if (isRoot) {
            state.contentTree = content;
          }

          cb(null, content);
        })
      )
      .on('error', onError);
  };
};
