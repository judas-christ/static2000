var path = require('path');

//local
var filterContentList = require('./filterContentList');

module.exports = function(state) {
  function ContentModel(options) {
    if (!(this instanceof ContentModel)) {
      return new ContentModel(options);
    }

    for (var key in options) {
      if (key.indexOf('_') !== 0) {
        this[key] = options[key];
      }
    }

    this._body = options._body || '';
    this._parent = options._parent;
    this._children = options._children || [];
  }

  ContentModel.prototype = {
    children: function(filter) {
      return filterContentList(this._children, filter);
    },
    descendants: function(filter) {
      var thisPath = (this.path + '/').replace('//', '/');
      var descs = state.contentList.filter(function(v) {
        return v.path.indexOf(thisPath) === 0 && v.path !== this.path;
      }, this); //this._children.map(function(v, i) { var kids = v._children.length ? v.descendants() : []; kids.push(v); console.log(kids); return kids; });

      return filterContentList(descs, filter);
    },
    parent: function() {
      return this._parent;
    },
    ascendants: function(filter) {
      var ascs = [];
      var curr = this;
      while (curr._parent) {
        ascs.push(curr._parent);
        curr = curr._parent;
      }

      return filterContentList(ascs, filter);
    },
    root: function() {
      return state.contentTree;
    },
    relativePath: function(currentPath) {
      var relPath = path
        .relative(currentPath || state.model.path, this.path)
        .replace(/\\/g, '/');
      return relPath ? relPath + '/' : '.'; //if path is empty, set it to . to prevent minifiers from removing href attribute on a tags
    }
  };

  return ContentModel;
};
