# Static2000

The simple static site generator built on node.js

## Installation

Via npm:

```bash
$ npm install static2000
```

You also need a template adapter, such as [static2000-jade](https://github.com/judas-christ/static2000-jade):

```bash
$ npm install static2000-jade --save-dev
```

## Usage

Static2000 takes templates and content and mashes them together to create a folder structure
and html files. It can be used from the command line or inside a node module and plays nice
with Gulp. Gulp is the recommended method of running Static2000, since it does not have any
CSS preprocessing or similar built in.

Templates and content can use [jade](http://jade-lang.com/) or [swig](http://paularmstrong.github.io/swig) with YAML front matter
for defining properties on content pages using template adapters.


See the [documentation](docs/README.md) for more information.

### Options

* `dest` Destination folder for generated html.
* `templates` Source folder for templates.
* `content` Source folder for content.
* `globalFunctions` An object with functions that should be available on all pages and in all templates. Note that it is often better to use a jade mixin defined in `templates/includes/globals.jade` or a [global plugin](docs/GlobalPlugins.md) instead.
* `baseUrl` Base URL for the site. Set this to create an XML sitemap when generating the site.
* `templateAdapter` The template adapter to use. Default is `static2000-jade`.

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

## 0.2.1

* Added loading of global plugins. It's now possible to write plugins that extend the globals object in templates and have access to options and a list of all content models.

## 0.2.0

* Extracted template engines into adapters. _This is a breaking change. Static2000 now requires a template adapter to work, and none is included. Install with `npm i static2000-jade` for jade templates._

## 0.1.6

* Refactored code
* Tests!

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
