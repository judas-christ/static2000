var File = require('vinyl');
var es = require('event-stream');
var createSitemapNodeFactory = require('./createSitemapNode');

module.exports = function(state) {
  return function(options, onError) {
    var baseUrl = options.baseUrl;

    if (!baseUrl) {
      console.log('No baseUrl defined; cannot generate XML sitemap');
      return es.readArray([]);
    }

    baseUrl = baseUrl.replace(/\/$/, '');
    var createSitemapNode = createSitemapNodeFactory(baseUrl);

    var xmlStr =
      '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    xmlStr += state.contentList
      .filter(function(contentObject) {
        return !contentObject.hidden;
      })
      .map(createSitemapNode)
      .sort()
      .join('');
    xmlStr += '</urlset>';

    var sitemapFile = new File({
      path: 'sitemap.xml',
      contents: new Buffer(xmlStr)
    });

    return es.readArray([sitemapFile]).on('error', onError);
  };
};
