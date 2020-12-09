'use strict';
const Generator = require('yeoman-generator');

const templateEngines = require('../../lib/templateAdapters');

module.exports = class TemplateGenerator extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument('name', { type: String, required: true });
  }

  initializing() {
    this.log('Generating template: ' + this.options.name);
  }

  configuring() {
    this.baseUrl = this.config.get('baseUrl');
    this.templateEngine = templateEngines[this.config.get('templateEngine')];
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath(
        this.templateEngine.name + '/_template.' + this.templateEngine.ext
      ),
      this.destinationPath(
        'src/templates/' + this.options.name + '.' + this.templateEngine.ext
      ),
      this.options
    );
  }
};
