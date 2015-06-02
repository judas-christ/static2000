'use strict';

var _ = require('lodash');

module.exports = function(list, filter) {
  if (typeof filter === 'function')
    return list.filter(filter);
  else if (typeof filter === 'object')
    return _.where(list, filter);
  return list.slice(0);
};
