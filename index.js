'use strict';

var es = require('event-stream');
var path = require('path');
var _ = require('lodash');

//default options
var defaults = {
    templates: path.join('src','templates'),
    content: path.join('src','content'),
    dest: 'www'
};

//default stream event handlers
var defaultOnError = require('./lib/defaultOnError');
var defaultOnSuccess = require('./lib/noop');

// function stringifyContent(key, value) {
//     return key.indexOf('_') === 0
//         ? undefined
//         : typeof value === 'function'
//             ? String(value)
//             : value;
// }

// function jsonify(obj) {
//     return JSON.stringify(obj, stringifyContent, 2);
// }

//global state
var state = require('./lib/state');

//build functions
var buildTemplates = require('./lib/buildTemplates')(state);
var buildContentList = require('./lib/buildContentList')(state);
var buildContentTree = require('./lib/buildContentTree')(state);
var buildPages = require('./lib/buildPages')(state);
var buildSitemap = require('./lib/buildSitemap')(state);

var buildSite = function(options, onSuccess, onError) {
    // if(typeof options === 'function' && typeof onSuccess === 'function') {
    //     onError = onSuccess;
    //     onSuccess = options;
    //     options = undefined;
    // }
    var opts = _.assign({}, defaults, options);

    var onErrorHandler = function(error) {
        (onError || defaultOnError)(error);
        this.emit('end');
    };
    var onSuccessHandler = onSuccess || defaultOnSuccess;

    //reset global variables
    state.reset();

    es.merge(buildTemplates(opts, onErrorHandler), buildContentList(opts, onErrorHandler))
        .on('end', function() {
            buildContentTree(opts, onErrorHandler)
                .on('end', function() {
                    buildPages(opts, onErrorHandler)
                        .on('end', function() {
                            buildSitemap(opts, onErrorHandler)
                                .on('end', onSuccessHandler);
                        });
                });
        });
};

module.exports = buildSite;
