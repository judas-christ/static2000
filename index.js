'use strict';

var defaults = {
    templates: 'src/templates/',
    content: 'src/content',
    dest: './www'
};

var fs = require('vinyl-fs');
var File = require('vinyl');
var es = require('event-stream');
var jade = require('jade');
var fm = require('front-matter');
var path = require('path');
var _ = require('lodash');
var colors = require('colors/safe');

//global variables
var templatesMap;
var contentTree;
var contentMap;
var contentList;

//default stream event handlers
var defaultOnError = function(error) {
    console.error(colors.red('An error occurred in static2000:'), String(error));
};
var defaultOnSuccess = function() {};

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
    return key.indexOf('_') === 0 ? undefined : value;
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
    this._root = options._root || this;
    this._parent = options._parent;
    this._children = options._children || [];
}

ContentModel.prototype = {
    children: function(filter) {
        if(typeof filter === 'function')
            return this._children.filter(filter);
        return this._children.slice();
    },
    descendants: function(filter) {
        var descs = contentList.filter(function(v) { return v.path.indexOf(this.path) === 0 && v.path !== this.path; }, this); //this._children.map(function(v, i) { var kids = v._children.length ? v.descendants() : []; kids.push(v); console.log(kids); return kids; });

        if(typeof filter === 'function')
            return descs.filter(filter);
        return descs;
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
        return ascs;
    },
    root: function() {
        return this._root;
    }
};

function findParent(root, path) {
    if(root) {
        if(path.indexOf(root.path) === 0) {
            for(var i=root._children.length;i--;) {
                if(path.indexOf(root._children[i].path) === 0) {
                    if(path.substring(root._children[i].path.length).indexOf('/')<0) {
                        return root[i];
                    }
                    return findParent(root._children[i], path);
                }
            }
            return root;
        }
        throw Error('Could not find parent for '+path);
    }
}

var buildContentTree = function(options, onError) {
    // console.log('buildContentTree', options);
    return fs.src('**/*.jade', {cwd: options.content})
        .pipe(es.map(function(file, cb) {
            var frontMatter = fm(String(file.contents));
            var relativePath = path.relative(file.cwd, file.path);
            var contentPath = path.dirname(relativePath);

            var isRoot = false;
            var parent;

            if(contentPath === '.') {
                contentPath = '/';
                isRoot = true;
            } else {
                contentPath = '/' + contentPath.replace('\\', '/');
                parent = findParent(contentTree, contentPath);
            }

            var contentOptions = {
                path: contentPath,
                _body: frontMatter.body
            }
            //copy attributes
            for(var key in frontMatter.attributes) {
                contentOptions[key] = frontMatter.attributes[key];
            }

            //private structural stuff
            contentOptions._root = contentTree;
            contentOptions._parent = parent;

            var contentObject = new ContentModel(contentOptions);

            if(parent) {
                parent._children.push(contentObject);
            }
            contentMap[contentPath] = contentObject;
            contentList.push(contentObject);

            if(isRoot) {
                contentTree = contentObject;
            }

            cb(null, file);
        }))
        .on('error', onError);
};

var buildPages = function(options, onError) {
    // console.log('buildPages', options);
    return es.readArray(contentList)
        .pipe(es.map(function(content, cb) {
            var template = templatesMap[content.template];
            if(!template) {
                cb(new Error('No template found named "' + String(content.template) + '" for content "' + content.path + '"'));
                return;
            }
            var globalFunctions = {
                getByPath: function(path) {
                    return contentMap[path];
                },
                query: function(q) {
                    return contentList.filter(function(v) {
                        for(var key in q) {
                            if(v[key] != q[key]) {
                                return false;
                            }
                        }
                        return true;
                    });
                }
            };
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

    es.merge(buildTemplates(opts, onErrorHandler), buildContentTree(opts, onErrorHandler))
        .on('end', function() {
            buildPages(opts, onErrorHandler)
                .on('end', onSuccessHandler);
        });
};

module.exports = buildSite;
