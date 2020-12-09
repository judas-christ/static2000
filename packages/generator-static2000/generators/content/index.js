'use strict';
const path = require('path');
const Generator = require('yeoman-generator');

const templateEngines = require('../../lib/templateAdapters');

module.exports = class ContentGenerator extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument('name', { type: String, required: true });
    this.argument('templateName', { type: String, required: true });

    this.baseUrl = this.config.get('baseUrl');
    this.option('flat', {
      desc: 'Create files in flat structure instead of folders'
    });
  }

  initializing() {
    this.log(`Generating content: ${this.name}`);

    //parse path from name if possible
    const contentPath = /^(?:[-_a-z0-9]+[\/\.])+/i.exec(this.options.name);

    if (contentPath) {
      let path = contentPath[0];
      this.options.name = this.options.name.replace(path, '');
      if (this.options.flat) {
        path = path.replace('/', '.');
      } else {
        path = path.replace('.', '/');
      }
      this.path = path;
    }
  }

  configuring() {
    this.templateEngine = templateEngines[this.config.get('templateEngine')];
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath(
        path.join(
          this.templateEngine.name,
          `_content.${this.templateEngine.ext}`
        )
      ),
      this.destinationPath(
        path.join(
          'src',
          'content',
          `${this.path || ''}${this.options.name}.${this.templateEngine.ext}`
        )
      ),
      this.options
    );
  }
};
