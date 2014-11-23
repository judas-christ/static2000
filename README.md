# Static2000

The simple static site generator built on node.js

## Installation

Via npm:

```bash
$ npm install static2000
```

## Usage

Static2000 takes templates and content and mashes them together to create a folder structure
and html files. It can be used from the command line or inside a node module and plays nice
with Gulp. Gulp is the recommended method of running Static2000, since it does not have any
CSS preprocessing or similar built in.

At the moment, templates must use [jade](http://jade-lang.com/) with YAML front matter
for defining properties on content pages. There are plans to support other template engines in the future.

See the [documentation](docs/README.md) for more information.

### Options

* `dest` Destination folder for generated html.
* `templates` Source folder for templates.
* `content` Source folder for content.
* `globalFunctions` An object with functions that should be available on all pages and in all templates. Note that it is often better to use a jade mixin defined in `templates/includes/globals.jade` instead.
* `baseUrl` Base URL for the site. Set this to create an XML sitemap when generating the site.

### API

Static2000 exports one function that takes three optional arguments. Options (see above), a success callback and and error callback.

```javascript
var static2000 = require('static2000');

static2000(options, onSuccess, onError);
```

### Gulp

Using static2000 together with [Gulp](http://gulpjs.com/) is simple, no plugin required:

```javascript
var static2000 = require('static2000');

gulp.task('static2000', function(cb) {
    static2000(null, cb);
});
```

# Change Log

## 0.1.5

* Last modified date added to sitemap.

## 0.1.4

* XML sitemap generation.

## 0.1.3

* Convert flat file list to folder structure.
* Page sort order.

## 0.1.2

* Bug fixes.
* Improved documentation.

## 0.1.1

* Fixed stream error handling.
* Fixed compiled body rendering.
* Fixed readme file layout issues.

# License

MIT
