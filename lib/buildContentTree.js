'use strict';

var es = require('event-stream');
var path = require('path');

//local
var findParent = function(contentMap, childPath) {
    var parentPath = (path.dirname(childPath) + '/').replace('//', '/');
    return contentMap[parentPath];
};

module.exports = function(state) {
    return function(options, onError) {
        return es.readArray(state.contentList)
            .pipe(es.map(function(content, cb) {

                var isRoot = false;
                var parent;

                if(content.path === '/') {
                    isRoot = true;
                } else {
                    parent = findParent(state.contentMap, content.path);
                }

                if(isNaN(content.order)) {
                    content.order = parent
                        ? parent._children.length
                        : 0;
                }

                if(parent) {
                    content._parent = parent;
                    parent._children.push(content);
                }

                if(isRoot) {
                    state.contentTree = content;
                }

                cb(null, content);
            }))
            .on('error', onError);
    };
};
