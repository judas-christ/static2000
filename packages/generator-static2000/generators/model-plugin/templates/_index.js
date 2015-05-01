'use strict';

module.exports = function(options, contentList) {
  var model = this;
  <% if(namespaced) { %>
  return {
    myPluginFunction: function() {
      return 'My model plugin was here!';
    }
  }
  <% } else { %>
  return function() {
    return 'My model plugin was here!'
  }
  <% } %>
};
