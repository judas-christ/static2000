'use strict';
var colors = require('colors/safe');

module.exports = function(error) {
    console.error(colors.red('An error occurred in static2000:'), String(error));
};
