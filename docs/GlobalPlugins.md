# Global Plugins

Global plugins are extensions for use in the templates, written as node modules. Plugins should export a function that takes two arguments: the first is the options used throughout Static2000 and contains the basePath if available, and the second is an `Array` of all `ContentModel`s for this site.

## Naming

The module name must match the pattern `static2000-global-*`. Plugin names are camelized, so a plugin module named `static2000-global-test-plugin` would be available as `testPlugin` in templates. All plugins are put under the namespace `plugins` on the globals object.

## Loading

All plugins added as dependencies to the current `package.json` are automatically loaded and available in all templates.

## Example

A hello world plugin named static2000-global-hello-world could look like this:

```js
module.exports = function(options, contentList) {
	return "Hello world!";
};
```

And would be used in a Pug template like so:

```jade
h1= plugins.helloWorld
```

Or in a Nunjucks template:

```htmldjango
<h1>{{ globals.plugins.helloWorld }}</h1>
```

This would output the following html:

```html
<h1>Hello world!</h1>
```
