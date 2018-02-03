var _ = require('lodash');

module.exports = function(list, filter) {
  return typeof filter === 'function'
    ? list.filter(filter)
    : typeof filter === 'object' ? _.filter(list, filter) : list.slice(0);
};
