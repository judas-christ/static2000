var path = require('path');

module.exports = function(contentMap, childPath) {
  var parentPath = (path.dirname(childPath) + '/').replace('//', '/');
  return contentMap[parentPath];
};
