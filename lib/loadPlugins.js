//based on gulp-load-plugins

'use strict';
var minimatch = require('minimatch').match;
var findup = require('findup-sync');
var path = require('path');

function arrayify(el) {
  return Array.isArray(el) ? el : [el];
}

function camelize(str) {
  return str.replace(/-(\w)/g, function(m, p1) {
    return p1.toUpperCase();
  });
}

module.exports = function(static2000options, options) {
  var finalObject = {};
  options = options || {};


    // pattern: 'static2000-global-*',
    // replaceString: /^static2000-global-/,
    // scope: 'dependencies',
    // config: '../../package.json'

static2000options = Object.create(static2000options||{});
console.log(static2000options);

  var pattern = options.pattern || 'static2000-global-*';
  var config = options.config || findup('package.json', {cwd: parentDir}); //TODO: should be parent of this package, not of this module
  var scope = arrayify(options.scope || ['dependencies', 'devDependencies', 'peerDependencies']);
  var replaceString = options.replaceString || /^static2000-global-/;
  var camelizePluginName = options.camelize === false ? false : true;
  var lazy = 'lazy' in options ? !!options.lazy : true;
  var requireFn = options.requireFn || require;
  var renameObj = options.rename || {};

  if (typeof config === 'string') {
    config = require(config);
  }

  if(!config) {
    throw new Error('Could not find dependencies. Do you have a package.json file in your project?');
  }

  var names = scope.reduce(function(result, prop) {
    return result.concat(Object.keys(config[prop] || {}));
  }, []);

  // pattern.push('!gulp-load-plugins');

  minimatch(names, pattern).forEach(function(name) {
    var requireName;

    if(renameObj[name]) {
      requireName = options.rename[name];
    } else {
      requireName = name.replace(replaceString, '');
      requireName = camelizePluginName ? camelize(requireName) : requireName;
    }

    if(lazy) {
      Object.defineProperty(finalObject, requireName, {
        get: function() {
          return requireFn(name)(static2000options);
        }
      });
    } else {
      finalObject[requireName] = requireFn(name)(static2000options);
    }
  });

  return finalObject;
};

var parentDir = path.dirname(module.parent.parent.parent.filename);

console.log('parentDir',parentDir);

// Necessary to get the current `module.parent` and resolve paths correctly.
delete require.cache[__filename];
