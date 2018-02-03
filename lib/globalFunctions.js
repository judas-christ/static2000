//requires
var url = require('url');
var _ = require('lodash');

//local
var plugins = require('./loadPlugins');
var filterContentList = require('./filterContentList');

module.exports = function globalFunctions(options, state) {
  return {
    getByPath: function(path) {
      return state.contentMap[path];
    },
    query: function(q) {
      return filterContentList(state.contentList, q);
    },
    absoluteUrl: function(path) {
      return url.resolve(options.baseUrl || '', path);
    },
    _: _, //expose lodash for use in templates
    plugins: plugins(null, options, state.contentList)
  };
};
