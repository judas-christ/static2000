var es = require('event-stream');
var fs = require('vinyl-fs');
var path = require('path');
var _ = require('lodash');

//default options
var defaults = {
  templateAdapter: 'static2000-pug',
  templates: path.join('src', 'templates'),
  content: path.join('src', 'content')
};

//default stream event handlers
var defaultOnError = require('./lib/defaultOnError');
var defaultOnSuccess = require('./lib/noop');

//global state
var state = require('./lib/state')();

//build functions
var buildTemplates = require('./lib/buildTemplates')(state);
var buildContentList = require('./lib/buildContentList')(state);
var compileContentBodies = require('./lib/compileContentBodies')(state);
var buildContentTree = require('./lib/buildContentTree')(state);
var buildPages = require('./lib/buildPages')(state);
var buildSitemap = require('./lib/buildSitemap')(state);

var buildSite = function(options, onSuccess, onError) {
  var opts = _.assign({}, defaults, options);

  var onErrorHandler = function(error) {
    (onError || defaultOnError)(error);
    this.emit('end');
  };
  var onSuccessHandler = onSuccess || defaultOnSuccess;

  //get template adapter here
  var templateAdapter = opts.templateAdapter;
  if (templateAdapter.indexOf('static2000-') < 0) {
    templateAdapter = 'static2000-' + templateAdapter;
  }
  opts.templateAdapter = require(templateAdapter);

  //reset global variables
  state.reset();

  //create output stream
  var pagesStream = opts.dest ? fs.dest(opts.dest) : es.through();
  var sitemapStream = opts.dest ? fs.dest(opts.dest) : es.through();

  es.merge(
    buildTemplates(opts, onErrorHandler),
    buildContentList(opts, onErrorHandler)
  ).on('end', function() {
    buildSitemap(opts, onErrorHandler).pipe(sitemapStream);
    buildContentTree(opts, onErrorHandler).on('end', function() {
      compileContentBodies(opts, onErrorHandler).on('end', function() {
        buildPages(opts, onErrorHandler).pipe(pagesStream);
      });
    });
  });
  return es.merge(pagesStream, sitemapStream).on('end', onSuccessHandler);
};

module.exports = buildSite;
