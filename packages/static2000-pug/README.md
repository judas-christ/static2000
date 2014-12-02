static2000-jade
===============

Jade adapter for [Static2000](https://github.com/judas-christ/static2000).

## Installation

Via npm:

```bash
$ npm install static2000-jade
```

## Usage

This is the default template adapter for static2000. Install, create templates and content as `.jade` files and run.

## Globals

### Global include

This adapter includes `[templates folder]/includes/globals.jade` in all files, templates and content, so mixins defined there are available both in the body of content and in templates:

```jade
+my-mixin()
```

### Global functions

The global functions are available without namespace in the templates:

```jade
- var visiblePages = query({ visible: true });
```
