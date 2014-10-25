# Static2000

The simple static site generator built on node.js

## Installation

Via npm:

´´´
$ npm install static2000
```

## Usage

Static2000 takes templates and content and mashes them together to create a folder structure 
and html files. It can be used from the command line or inside a node module and plays nice 
with Gulp. Gulp is the recommended method of running Static2000, since it does not have any 
CSS preprocessing or similar built in.

At the moment, templates must use [jade](http://jade-lang.com/) with YAML front matter 
for defining properties on content pages. There are plans to support Jinja2 templates as well.

The default folder structure for source and output files is:

```
www
src
|- content
|- templates
|  |- includes
```

### Options

* `dest` Destination folder for generated html.
* `templates` Source folder for templates.
* `content` Source folder for content.
* `globalFunctions` An object with functions that should be available on all pages and in all templates.


### API

Static2000 exports one function that takes three optional arguments. Options (see above), a success callback and and error callback.

```
var static2000 = require('static2000');

static2000(options, onSuccess, onError);
```


### Gulp

Using static2000 together with [Gulp](http://gulpjs.com/) is simple, no plugin required:

```
var static2000 = require('static2000');

gulp.task('static2000', function(cb) {
    static2000(null, cb);
});
```

# License

MIT