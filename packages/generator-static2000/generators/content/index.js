'use strict';
var yeoman = require('yeoman-generator');

module.exports = yeoman.generators.NamedBase.extend({
  initializing: function () {
    this.log('Generating content: ' + this.name);

    this.baseUrl = this.config.get('baseUrl');
    this.templateEngine = this.config.get('templateEngine');

    this.argument('templateName', { type: String, required: true });
    this.option('flat', { desc: 'Create files in flat structure instead of folders' });

    //parse path from name if possible
    var contentPath = /^(?:[-_a-z0-9]+[\/\.])+/i.exec(this.name);
    if(contentPath) {
      var path = contentPath[0];
      this.name = this.name.replace(path, '');
      if(this.options.flat) {
        path = path.replace('/', '.');
      } else {
        path = path.replace('.', '/');
      }
      this.path = path;
    }
  },

  writing: function () {
    this.fs.copyTpl(
      this.templatePath(this.templateEngine.name + '/_content.' + this.templateEngine.ext),
      this.destinationPath('src/content/' + (this.path || '') + this.name + '.' + this.templateEngine.ext),
      this
    );
  }
});
