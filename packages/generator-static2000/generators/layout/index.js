'use strict';
const Generator = require('yeoman-generator');

const templateEngines = require('../../lib/templateAdapters');

module.exports = class LayoutGenerator extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument('name', { type: String, required: true });
  }

  initializing() {
    this.log('Generating layout: ' + this.name);
  }

  configuring() {
    this.baseUrl = this.config.get('baseUrl');
    this.templateEngine = templateEngines[this.config.get('templateEngine')];
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath(
        this.templateEngine.name + '/_layout.' + this.templateEngine.ext
      ),
      this.destinationPath(
        'src/templates/layouts/' +
          this.options.name +
          '.' +
          this.templateEngine.ext
      ),
      this
    );
  }
};
