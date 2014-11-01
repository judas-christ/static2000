# Reference

## ContentModel

When a content page is parsed, a model of type `ContentModel` is created. This model is available in the template as `model`. ContentModels contain the properties parsed from the YAML front matter for the page, some predefined properties, and a number of methods for traversing and finding other pages.

### model.path

Type: `String`

The path to this page. Useful when linking to a page.

### model.template

Type: `String`

The name of the template used when rendering this page.

### model.order

Type: `Number`

The sort order for this page. Can be explicitly defined by prefixing the filename with a number and a dash. Eg. `2-page-name.jade` will become a page named `page-name` with an `order` of 2. Useful when pages should not be listed alphabetically.

### model.hidden

Type: `Boolean`

Whether this page is hidden. Can be used for hiding pages in lists and a value of `true` will prevent the page from showing up in the generated sitemap.

### model.children([filter])

Get all children of the current model, optionally filtered.

### model.parent()

Get the parent of the current model. If the current model is the root, parent() will be `undefined`.

### model.descendants([filter])

Get the descendants of the current model, optionally filtered.

### model.ascendants([filter])

Get the ascendants of the current model, optionally filtered. The parent comes first in the returned Array, then its parent and so on.

### model.root()

Get the root page's model.

### model.relativePath([basePath])

Get the path to this page relative to `basePath`. Useful when the site should live in a subdirectory.

#### basePath

Type: `String`

The base path to get a relative path from. If it's not explicitly supplied, the current model's `path` property will be used.

## Global functions

The global functions are utility functions for finding content.

### getByPath(path)

Get a page's model by the path.

#### path

Type: `String`

The path of the page to get. Returns `undefined` if no page is found.

### query(filter)

Get all page models matching the filter.

### _

[Lodash](https://lodash.com/) is available in templates for convenience.

## Filtering

Most methods available in Static2000 that return a list of ContentModels accept a filter as an argument. The filter can be a function or an object. If it's a function it should take the ContentModel as first argument and return true if the page should be kept, and false if it should be filtered out. If the filter is an object, each property in the object will be matched against the same property on every page in the list. If all properties match, the page is kept, if not it is filtered.

```jade
//- Get all children of the root page that have a property named visible that equals true.
each page in root().children({visible: true})
    ...
```
