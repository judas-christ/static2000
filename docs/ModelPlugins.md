# Model Plugins

Model plugins are extensions for the `ContentModel`, written as node modules. Model plugins should export a single function taking two arguments: an options object and a content list. `this` inside the function is the current `ContentModel` instance when the plugin is accessed from a template. The function should return a function or an object with functions or properties that can be used in the templates.

## Naming

Model plugin module names must match the pattern `static2000-model-*`. Model plugin names are camelized.

## Loading

All model plugins registered in package.json will be loaded automatically and attached to `ContentModel`.

## Example

### Single function

A plugin that gets all siblings to the current page, called `static2000-model-siblings` could look something like this:

```js
module.exports = function(options, contentList) {
    var model = this;
    return function() {
        var parent = model.parent();
        return parent ? parent.children(function(m) { return m !== model }) : [];
    }
};
```

and would be used in a template like this:

```jade
ul
    for sibling in model.siblings()
        li
            a(href=sibling.path)= sibling.title
```

### Several namespaced functions

A plugin containing several functions in the namespace `pageOrder` called  `static2000-model-page-order` could look like this:

```js
module.exports = function(options, contentList) {
    var model = this;
    return {
        isFirst: function() {
            var siblings = model.parent() && model.parent().children();
            return siblings ? siblings[0] === model : true;
        },
        isLast: function() {
            var siblings = model.parent() && model.parent().children();
            return siblings ? siblings[siblings.length-1] === model : true;
        }
    };
};
```

and could be used like this:

```jade
ul
    for child in model.children()
        li(class=(child.pageOrder.isFirst() ? 'first' : child.pageOrder.isLast() ? 'last' : ''))
            = child.title
```
