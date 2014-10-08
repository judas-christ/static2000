'use strict';

var defaults = {
    templates: 'src/templates/*.jade',
    content: 'src/content/**/*.jade',
    dest: './www'
};

var fs = require('vinyl-fs');
var File = require('vinyl');
var map = require('map-stream');
var jade = require('jade');
var fm = require('front-matter');
var path = require('path');

var templatesMap = {};

var log = function(file, cb) {
    console.log(file.path, templatesMap);
    cb(null, file);
};

var buildTemplates = function() {
    console.log('buildTemplates');
    fs.src(defaults.templates)
        .pipe(map(function(file, cb) {
            var name = path.basename(file.path, path.extname(file.path));
            var template = jade.compile(String(file.contents), {
                filename: file.path,
                pretty: true
            });
            templatesMap[name] = template;
            cb(null, file);
        }))
        .on('end', buildPages);
};

var buildPages = function() {
    console.log('buildPages')
    fs.src(defaults.content)
        .pipe(map(function(file, cb) {
            //parse front matter
            var frontMatter = fm(String(file.contents));
            console.log(file.path, frontMatter);
            //get template
            var template = templatesMap[frontMatter.attributes.template];
            if(!template)
                cb(new Error('No template found named '+String(frontMatter.attributes.template)+' for content '+file.path));
            //render with front matter as locals
            var locals = frontMatter.attributes;
            var htmlBody = jade.render(frontMatter.body, locals);
            locals.body = htmlBody;
            var html = template(locals);
            //create new file object
            var newFile = new File({
                cwd: file.cwd,
                base: file.base,
                path: path.join(path.dirname(file.path), path.basename(file.path, path.extname(file.path)), 'index.html'),
                contents: new Buffer(html)
            });
            console.log('cwd\t',newFile.cwd, '\nbase\t',newFile.base,'\npath\t', newFile.path);
            cb(null, newFile);
        }))
        .pipe(fs.dest(defaults.dest))
        .on('end', function() {
            console.log('done');
        });
}

buildTemplates();
