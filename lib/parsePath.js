var path = require('path');

module.exports = function(relativePath, ext) {
  var orderAndNameRegex = /^(?:(\d+)-)?(.+)$/;

  var dirnames = path.dirname(relativePath).split(path.sep);
  var basenames = path.basename(relativePath, ext).split('.');
  var basename = basenames.pop();
  dirnames = dirnames
    .filter(function(v) {
      return v !== '.';
    })
    .concat(
      basenames.map(function(v) {
        return orderAndNameRegex.exec(v)[2];
      })
    );

  var orderAndName = orderAndNameRegex.exec(basename);
  var order = Number(orderAndName[1]);
  var filename = orderAndName[2];

  var dirname = filename === 'index' ? '' : filename;

  var url = (
    '/' +
    path
      .join(dirnames.join(path.sep), dirname)
      .replace(/\./, '')
      .replace(/\\/g, '/') +
    '/'
  ).replace(/\/\/+/g, '/');

  return {
    order: order,
    path: url
  };
};
