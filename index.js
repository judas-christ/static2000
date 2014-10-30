'use strict';

var fs = require('vinyl-fs');
var File = require('vinyl');
var es = require('event-stream');
var jade = require('jade');
var fm = require('front-matter');
var path = require('path');
var _ = require('lodash');

var defaults = {
    templates: path.join('src','templates'),
    content: path.join('src','content'),
    dest: 'www'
};

//global variables
var templatesMap;
var contentTree;
var contentMap;
var contentList;

//the current page's model
var model;

//default stream event handlers
var defaultOnError = require('./lib/defaultOnError');
var defaultOnSuccess = require('./lib/noop');

var filterContentList = function(list, filter) {
    if(typeof filter === 'function')
        return list.filter(filter);
    else if(typeof filter === 'object')
        return _.where(list, filter);
    return list.slice(0);
};

var buildTemplates = function(options, onError) {
    // console.log('buildTemplates', options);
    return fs.src('*.jade', {cwd: options.templates})
        .pipe(es.map(function(file, cb) {

            var name = path.basename(file.path, path.extname(file.path));
            var fileContents = String(file.contents);
            fileContents = 'include ./includes/globals.jade\n' + fileContents;

            var template = jade.compile(fileContents, {
                filename: file.path,
                pretty: true
            });

            templatesMap[name] = template;

            cb(null, file);
        }))
        .on('error', onError);
};

function stringifyContent(key, value) {
    return key.indexOf('_') === 0
        ? undefined
        : typeof value === 'function'
            ? String(value)
            : value;
}

function jsonify(obj) {
    return JSON.stringify(obj, stringifyContent, 2);
}

function ContentModel(options) {
    if(!this instanceof ContentModel) {
        return new ContentModel(options);
    }

    for(var key in options) {
        if(key.indexOf('_') != 0) {
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
        var descs = contentList.filter(function(v) { return v.path.indexOf(this.path + '/') === 0 && v.path !== this.path; }, this); //this._children.map(function(v, i) { var kids = v._children.length ? v.descendants() : []; kids.push(v); console.log(kids); return kids; });

        return filterContentList(descs, filter);
    },
    parent: function() {
        return this._parent;
    },
    ascendants: function(filter) {
        var ascs = [];
        var curr = this;
        while(curr._parent) {
            ascs.push(curr._parent);
            curr = curr._parent;
        }

        return filterContentList(ascs, filter);
    },
    root: function() {
        return contentTree;
    },
    relativePath: function(currentPath) {
        var relPath = path.relative(currentPath || model.path, this.path).replace(/\\/g, '/');
        return relPath ? relPath + '/' : '.'; //if path is empty, set it to . to prevent minifiers from removing href attribute on a tags
    }
};

// function findParent(root, path) {
//     if(root) {
//         if(path.indexOf(root.path) === 0) {
//             for(var i=root._children.length;i--;) {
//                 if(path.indexOf(root._children[i].path) === 0) {
//                     if(path.substring(root._children[i].path.length).indexOf('/')<0) { //todo: does this work now?
//                         return root[i];
//                     }
//                     return findParent(root._children[i], path);
//                 }
//             }
//             return root;
//         }
//         throw Error('Could not find parent for '+path);
//     }
// }
function findParent(contentMap, childPath) {
    var parentPath = (path.dirname(childPath) + '/').replace('//', '/');
    return contentMap[parentPath];
}

var parsePath = function(relativePath, ext) {
    var orderAndNameRegex = /^(?:(\d+)-)?(.+)$/;

    var dirnames = path.dirname(relativePath).split(path.sep);
    var basenames = path.basename(relativePath, ext).split('.');
    var basename = basenames.pop();
    dirnames = dirnames.filter(function(v) { return v !== '.'; }).concat(basenames.map(function(v) { return orderAndNameRegex.exec(v)[2]; }));

    var orderAndName = orderAndNameRegex.exec(basename);
    var order = Number(orderAndName[1]);
    var filename = orderAndName[2];

    var dirname = filename === 'index'
        ? ''
        : filename;

    var url = ('/' + path.join(dirnames.join(path.sep), dirname).replace(/\./, '').replace(/\\/g, '/') + '/').replace(/\/\/+/g, '/');

    return {
        order: order,
        path: url
    };
}

var buildContentList = function(options, onError) {
    return fs.src(path.join('**','*.jade'), {cwd: options.content})
        .pipe(es.map(function(file, cb) {

            var frontMatter = fm(String(file.contents));
            var relativePath = path.relative(file.cwd, file.path);
            var parsedPath = parsePath(relativePath, '.jade');

            var contentOptions = {
                path: parsedPath.path,
                order: parsedPath.order,
                _body: frontMatter.body
            }
            //copy attributes
            for(var key in frontMatter.attributes) {
                contentOptions[key] = frontMatter.attributes[key];
            }

            var contentObject = new ContentModel(contentOptions);

            contentMap[parsedPath.path] = contentObject;
            contentList.push(contentObject);

            cb(null, contentObject);
        }))
        .on('error', onError);
};

var buildContentTree = function(options, onError) {
    return es.readArray(contentList)
        .pipe(es.map(function(content, cb) {

            var isRoot = false;
            var parent;

            if(content.path === '/') {
                isRoot = true;
            } else {
                parent = findParent(contentMap, content.path);
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
                contentTree = content;
            }

            cb(null, content);
        }))
        .on('error', onError);
};

var buildPages = function(options, onError) {
    // console.log('buildPages', options);
    var globalFunctions = {
        getByPath: function(path) {
            return contentMap[path];
        },
        query: function(q) {
            return filterContentList(contentList, q);
        },
        '_': _ //expose lodash for use in templates
    };
    return es.readArray(contentList)
        .pipe(es.map(function(content, cb) {

            model = content;

            var template = templatesMap[content.template];
            if(!template) {
                cb(new Error('No template found named "' + String(content.template) + '" for content "' + content.path + '"'));
                return;
            }
            //create a locals object that contains the content so that we can call the functions on the content object, and also add global functions later if we want
            var locals = _.assign({}, globalFunctions, options.globalFunctions, {
                filename: path.join(options.templates, 't'), //fake filename so includes are available
                model: content
            });
            var contentBody = 'include ./includes/globals.jade\n' + content._body;
            var htmlBody = jade.render(contentBody, locals);

            content.body = htmlBody;
            locals = _.assign({}, globalFunctions, options.globalFunctions, {
                model: content
            });
            var html = template(locals);

            var filePath = content.path.substring(1);
            var fileOptions = {
                path: path.join(filePath, 'index.html'),
                contents: new Buffer(html)
            };
            var file = new File(fileOptions);

            model = undefined;

            cb(null, file);
        }))
        .on('error', onError)
        .pipe(fs.dest(options.dest))
}

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
    templatesMap = {};
    contentTree = undefined;
    contentMap = {};
    contentList = [];
    model = undefined;

    es.merge(buildTemplates(opts, onErrorHandler), buildContentList(opts, onErrorHandler))
        .on('end', function() {
            buildContentTree(opts, onErrorHandler)
                .on('end', function() {
                    buildPages(opts, onErrorHandler)
                        .on('end', onSuccessHandler);
                })
        });
};

module.exports = buildSite;
