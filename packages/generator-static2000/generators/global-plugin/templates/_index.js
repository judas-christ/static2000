'use strict';

module.exports = function(options, contentList) {
  <% if(namespaced) { %>
  return {
    myPluginFunction: function() {
      return 'My global plugin was here';
    }
  }
  <% } else { %>
  return function() {
    return 'My global plugin was here!'
  }
  <% } %>
};
