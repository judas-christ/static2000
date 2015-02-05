# Global Plugins

Global plugins are extensions for use in the templates, written as node modules. Plugins should export a function that takes a single options argument. The options are those used by Static2000 when building the site, so you can get to the baseUrl property for instance if one has been specified.

## Naming

The module name must match the pattern `static2000-global-*`. Plugin names are camelized, so a plugin module named `static2000-global-test-plugin` would be available as `testPlugin` in templates. All plugins are put under the namespace `plugins` on the globals object.

## Loading

All plugins added as dependencies to the current `package.json` are automatically loaded and available in all templates.

## Example

A hello world plugin named static2000-global-hello-world could look like this:

```js
module.exports = function(options) {
	return "Hello world!";
};
```

And would be used in a Jade template like so:

```jade
h1= plugins.helloWorld
```

Or in a Swig template:

```htmldjango
<h1>{{ globals.plugins.helloWorld }}</h1>
```

This would output the following html:

```html
<h1>Hello world!</h1>
```