'use strict';
var yeoman = require('yeoman-generator');

module.exports = yeoman.generators.Base.extend({

  constructor: function() {
    yeoman.generators.Base.apply(this, arguments);

    this.argument('name', {type: String, required: false, defaults: this.appname });
  },

  initializing: function () {
    this.log('Generating model plugin: ' + this.name);
  },

  prompting: function () {

    var done = this.async();

    var prompts = [{
      type: 'confirm',
      name: 'namespaced',
      message: 'Should it be namespaced?'
    }];

    this.prompt(prompts, function(props) {

      this.namespaced = props.namespaced;

      done();
    }.bind(this));
  },

  configuring: function() {
  },

  writing: function () {
    this.fs.copyTpl(
      this.templatePath('_index.js'),
      this.destinationPath('index.js'),
      this
    );
    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'),
      this
    );
  }
});
