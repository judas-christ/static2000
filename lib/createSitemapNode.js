module.exports = function(baseUrl) {
  return function(contentObject) {
    return (
      '<url><loc>' +
      baseUrl +
      contentObject.path +
      '</loc><lastmod>' +
      contentObject.modified.toISOString() +
      '</lastmod></url>'
    );
  };
};
