# generator-static2000 [![Build Status](https://secure.travis-ci.org/judas-christ/generator-static2000.png?branch=master)](https://travis-ci.org/judas-christ/generator-static2000)

[Yeoman](http://yeoman.io) generator that scaffolds a [Static2000](https://github.com/judas-christ/static2000) site. Like a boss.

## Features

* Static2000
* Jade or Swig templates
* Gulp
* Autoprefixer
* Sass or Less
* Csso
* Uglifier
* BrowserSync

## Getting Started

Install: `npm install -g generator-static2000`
Run: `yo static2000`
Run `gulp build` to build the site or plain old `gulp` to build and preview it in a browser.

## Commands

* `yo static2000` scaffolds an entire project with a default layout, globals, one template and a single content page.
* `yo static2000:content NAME TEMPLATE [--flat]` generates one content page with name `NAME` and the template `TEMPLATE`. You may include the path of the page in `NAME` to create a sub-page. Specifying `--flat` will create the page using a flat file name instead of in a folder structure.
* `yo static2000:template NAME` generates a template called `NAME`.
* `yo static2000:layout NAME` generates a layout called `NAME`.

## License

MIT
