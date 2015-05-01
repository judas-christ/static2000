'use strict';

var es = require('event-stream');
var fs = require('vinyl-fs');
var path = require('path');
var _ = require('lodash');

//default options
var defaults = {
    templateAdapter: 'static2000-jade',
    templates: path.join('src','templates'),
    content: path.join('src','content')
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
var state = require('./lib/state')();

//build functions
var buildTemplates = require('./lib/buildTemplates')(state);
var buildContentList = require('./lib/buildContentList')(state);
var compileContentBodies = require('./lib/compileContentBodies')(state);
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

    //get template adapter here
    var templateAdapter = opts.templateAdapter;
    if(templateAdapter.indexOf('static2000-') < 0)
        templateAdapter = 'static2000-' + templateAdapter;
    opts.templateAdapter = require(templateAdapter);

    //reset global variables
    state.reset();

    //create output stream
    var outStream = es.through(function(data) {
        this.emit('data', data);
    });
    //and make sure generated files are written to disk if dest option was specified
    if(opts.dest) {
        outStream
            .pipe(fs.dest(opts.dest));
    }
    var outStreamWrite = outStream.write.bind(outStream);

    es.merge(buildTemplates(opts, onErrorHandler), buildContentList(opts, onErrorHandler))
        .on('end', function() {
            compileContentBodies(opts, onErrorHandler)
                .on('end', function() {
                    buildContentTree(opts, onErrorHandler)
                        .on('end', function() {
                            buildPages(opts, onErrorHandler)
                                .on('data', outStreamWrite)
                                .on('end', function() {
                                    buildSitemap(opts, onErrorHandler)
                                        .on('data', outStreamWrite)
                                        .on('end', function() {
                                            outStream.end();
                                            onSuccessHandler();
                                        });
                                });
                        });
                });

        });
    return outStream;
};

module.exports = buildSite;
