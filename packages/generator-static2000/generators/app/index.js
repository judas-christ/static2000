'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

var templateEngines = require('../../lib/templateAdapters');
var cssPreprocessors = require('../../lib/cssPreprocessors');

module.exports = yeoman.generators.Base.extend({

  constructor: function() {
    yeoman.generators.Base.apply(this, arguments);

    this.argument('name', {type: String, required: false, defaults: this.appname });
  },

  initializing: function () {
    this.pkg = require('../../package.json');

    this.name = this._.slugify(this.name);

    this.composeWith('static2000:layout', { args: ['default'] });
    this.composeWith('static2000:template', { args: ['start'] });
    this.composeWith('static2000:content', { args: ['index', 'start'] });
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the official ' + chalk.cyan('Static2000') + ' generator!'
    ));

    var prompts = [{
      type: 'list',
      name: 'templateEngine',
      message: 'Which template engine do you prefer?',
      choices: [{name: 'Jade', value: 'jade'}, {name: 'Swig', value: 'swig'}],
      store: true,
      default: 0
    },{
      type: 'list',
      name: 'cssPreprocessor',
      message: 'Which CSS preprocessor do you prefer?',
      choices: [{name: 'Sass', value: 'sass'},{name: 'Less', value: 'less'}],
      store: true,
      default: 0
    },{
      type: 'input',
      name: 'baseUrl',
      message: 'What is the base url of the site?',
      validate: function(value) {
        return /^https?:\/\/[\w\.]+\.[a-z]{2,}(?:\/\S*)$|/.exec(value)
          ? true
          : 'Please provide a valid url or leave empty';
      }
    }];

    this.prompt(prompts, function (props) {

      this.templateEngine = templateEngines[props.templateEngine];
      this.cssPreprocessor = cssPreprocessors[props.cssPreprocessor];

      var baseUrl = props.baseUrl ? props.baseUrl.replace(/\/$/, '') : '';
      this.baseUrl = baseUrl ? '\''+baseUrl+'\'' : 'undefined';

      this.config.set('baseUrl', baseUrl);
      this.config.set('templateEngine', props.templateEngine);
      this.config.set('cssPreprocessor', props.cssPreprocessor);

      done();
    }.bind(this));
  },

  // installNpmPackages: function() {
  //   this.npmInstall(
  //     [
  //       'static2000',
  //       this.templateEngine.adapter,
  //       'gulp',
  //       'gulp-load-plugins',
  //       'gulp-util',
  //       this.cssPreprocessor.plugin,
  //       'gulp-autoprefixer',
  //       'gulp-csso',
  //       'gulp-uglify',
  //       'browser-sync',
  //       'del'
  //     ],{
  //       saveDev: true
  //     });
  // },

  writing: {
    app: function () {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        this
      );
      this.fs.copyTpl(
        this.templatePath('_bower.json'),
        this.destinationPath('bower.json'),
        this
      );
      this.fs.copyTpl(
        this.templatePath('_gulpfile.js'),
        this.destinationPath('gulpfile.js'),
        this
      );

      //create globals file
      this.fs.write(
        this.destinationPath('src/templates/includes/globals.' + this.templateEngine.ext),
        this.engine(this.templateEngine.comment, { comment: 'Put your global utilities here, they will be available in all templates and content' }));

      //create empty style and script files
      this.fs.write(
        this.destinationPath('src/styles/styles.' + this.cssPreprocessor.ext),
        'html { color: gold; }\n'
      );
      this.fs.write(
        this.destinationPath('src/scripts/script.js'),
        '\'use strict\'\n'
      );

      //create folders
      this.fs.copy(
        this.templatePath('gitkeep'),
        this.destinationPath('src/images/.gitkeep')
      );
    },

    projectfiles: function () {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );
    }
  },

  install: function () {
    this.installDependencies({
      skipInstall: this.options['skip-install']
    });
  }
});
