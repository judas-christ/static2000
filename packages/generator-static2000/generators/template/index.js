'use strict';
var yeoman = require('yeoman-generator');

var templateEngines = require('../../lib/templateAdapters');

module.exports = yeoman.generators.NamedBase.extend({
  initializing: function () {
    this.log('Generating template: ' + this.name);
  },

  configuring: function() {
    this.baseUrl = this.config.get('baseUrl');
    this.templateEngine = templateEngines[this.config.get('templateEngine')];
  },

  writing: function () {
    this.fs.copyTpl(
      this.templatePath(this.templateEngine.name + '/_template.' + this.templateEngine.ext),
      this.destinationPath('src/templates/' + this.name + '.' + this.templateEngine.ext),
      this
    );
  }
});
