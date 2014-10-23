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

var templatesMap = {};
var contentTree;
var contentMap = {};
var contentList = [];

var log = function(file, cb) {
    console.log(file.path, templatesMap);
    cb(null, file);
};

var buildTemplates = function() {
    console.log('buildTemplates');
    return fs.src('*.jade', {cwd:defaults.templates})
        .pipe(es.map(function(file, cb) {
            var name = path.basename(file.path, path.extname(file.path));
            var template = jade.compile(String(file.contents), {
                filename: file.path,
                pretty: true
            });
            templatesMap[name] = template;
            cb(null, file);
        }));
};

function stringifyContent(key, value) {
    return key.indexOf('_') === 0 ? undefined : value;
}

function Content(options) {
    if(!this instanceof Content) {
        return new Content(options);
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

Content.prototype = {
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

var buildContentTree = function() {
    console.log('buildContentTree');
    return fs.src('**/*.jade', {cwd: defaults.content})
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

            var contentObject = new Content(contentOptions);

            if(parent) {
                parent._children.push(contentObject);
            }
            contentMap[contentPath] = contentObject;
            contentList.push(contentObject);

            if(isRoot) {
                contentTree = contentObject;
            }

            cb(null, file);
        }));
};

var buildPages = function() {
    console.log('buildPages');
    return es.readArray(contentList)
        .pipe(es.map(function(content, cb) {
            var template = templatesMap[content.template];
            if(!template) {
                cb(new Error('No template found named "' + String(content.template) + '" for content "' + content.path + '"'));
                return;
            }
            //create a locals object that contains the content so that we can call the functions on the content object, and also add global functions later if we want
            var locals = {
                model: content
            };
            var htmlBody = jade.render(content._body, locals);
            locals.body = htmlBody;
            var html = template(locals);
            var filePath = content.path.substring(1);
            var fileOptions = {
                path: path.join(filePath, 'index.html'),
                contents: new Buffer(html)
            };
            var file = new File(fileOptions);
            cb(null, file);
        }))
        .pipe(fs.dest(defaults.dest))
}

es.merge(buildTemplates(), buildContentTree())
    .on('end', buildPages);

