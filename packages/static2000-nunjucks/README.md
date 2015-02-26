# static2000-nunjucks

Nunjucks adapter for [Static2000](https://github.com/judas-christ/static2000).

## Installation

Via npm:

```bash
npm install static2000-nunjucks
```

## Usage

Install, create templates and content as `.html` files and run [static2000](https://github.com/judas-christ/static2000) with `templateAdapter` specified:

```bash
static2000 --templateAdapter static2000-nunjucks
```

or

```js
var static2000 = require('static2000');

static2000({ templateAdapter: 'static2000-nunjucks' });
```

## Globals

### Global include

This adapter includes `[templates folder]/includes/globals.html` in all files, templates and content, so macros defined there are available both in the body of content and in templates:

```html+django
{{ globals.myMacro() }}
```

### Global functions

The global functions are available without namespace in the templates:

```html+django
{% set visiblePages = query({ visible: true }) %}
```
