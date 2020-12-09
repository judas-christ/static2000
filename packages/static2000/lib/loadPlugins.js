//based on gulp-load-plugins

var minimatch = require('minimatch').match;
var findup = require('findup-sync');
//var path = require('path');

function arrayify(el) {
  return Array.isArray(el) ? el : [el];
}

function camelize(str) {
  return str.replace(/-(\w)/g, function(m, p1) {
    return p1.toUpperCase();
  });
}

module.exports = function(options) {
  var finalObject = {};
  options = options || {};
  var requireFnArgs = Array.prototype.slice.call(arguments, 1);

  var pattern = options.pattern || 'static2000-global-*';
  var config = options.config || findup('package.json'); //from current process working dir
  var scope = arrayify(
    options.scope || ['dependencies', 'devDependencies', 'peerDependencies']
  );
  var replaceString = options.replaceString || /^static2000-global-/;
  var camelizePluginName = options.camelize === false ? false : true;
  var lazy = 'lazy' in options ? !!options.lazy : true;
  var requireFn = options.requireFn || require;
  var renameObj = options.rename || {};
  var apply = 'apply' in options ? !!options.apply : true;

  if (typeof config === 'string') {
    config = require(config);
  }

  if (!config) {
    throw new Error(
      'Could not find dependencies. Do you have a package.json file in your project?'
    );
  }

  var names = scope.reduce(function(result, prop) {
    return result.concat(Object.keys(config[prop] || {}));
  }, []);

  minimatch(names, pattern).forEach(function(name) {
    var requireName;

    if (renameObj[name]) {
      requireName = options.rename[name];
    } else {
      requireName = name.replace(replaceString, '');
      requireName = camelizePluginName ? camelize(requireName) : requireName;
    }

    if (apply) {
      if (lazy) {
        Object.defineProperty(finalObject, requireName, {
          get: function() {
            return requireFn(name).apply(null, requireFnArgs);
          },
          enumerable: true
        });
      } else {
        finalObject[requireName] = requireFn(name).apply(null, requireFnArgs);
      }
    } else {
      finalObject[requireName] = requireFn(name);
    }
  });

  return finalObject;
};
