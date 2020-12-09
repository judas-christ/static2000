'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const _ = require('lodash');

const templateEngines = require('../../lib/templateAdapters');
const cssPreprocessors = require('../../lib/cssPreprocessors');

module.exports = class AppGenerator extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument('name', {
      type: String,
      required: true,
      default: this.appname
    });
  }

  initializing() {
    this.pkg = require('../../package.json');

    this.name = _.kebabCase(this.name);

    this.composeWith('static2000:layout', { args: ['default'] });
    this.composeWith('static2000:template', { args: ['start'] });
    this.composeWith('static2000:content', { args: ['index', 'start'] });
  }

  async prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the official ${chalk.cyan('Static2000')} generator!`)
    );

    var prompts = [
      {
        type: 'list',
        name: 'templateEngine',
        message: 'Which template engine do you prefer?',
        choices: Object.keys(templateEngines).reduce(function(arr, key) {
          arr.push({
            name: templateEngines[key].display,
            value: templateEngines[key].name
          });
          return arr;
        }, []),
        store: true,
        default: 0
      },
      {
        type: 'list',
        name: 'cssPreprocessor',
        message: 'Which CSS preprocessor do you prefer?',
        choices: Object.keys(cssPreprocessors).reduce(function(arr, key) {
          arr.push({
            name: cssPreprocessors[key].display,
            value: cssPreprocessors[key].name
          });
          return arr;
        }, []),
        store: true,
        default: 0
      },
      {
        type: 'input',
        name: 'baseUrl',
        message: 'What is the base url of the site?',
        validate: function(value) {
          return /^https?:\/\/[\w\.]+\.[a-z]{2,}(?:\/\S*)$|/.exec(value)
            ? true
            : 'Please provide a valid url or leave empty';
        }
      }
    ];

    const answers = await this.prompt(prompts);
    this.templateEngine = templateEngines[answers.templateEngine];
    this.cssPreprocessor = cssPreprocessors[answers.cssPreprocessor];

    const baseUrl = answers.baseUrl ? answers.baseUrl.replace(/\/$/, '') : '';
    this.baseUrl = baseUrl ? `'${baseUrl}'` : 'undefined';

    this.config.set('baseUrl', baseUrl);
    this.config.set('templateEngine', answers.templateEngine);
    this.config.set('cssPreprocessor', answers.cssPreprocessor);
  }

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

  writing() {
    // app() {
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
      this.destinationPath(
        `src/templates/includes/globals.${this.templateEngine.ext}`
      ),
      _.template(this.templateEngine.comment)({
        comment:
          'Put your global utilities here, they will be available in all templates and content'
      })
    );

    //create empty style and script files
    this.fs.write(
      this.destinationPath(`src/styles/styles.${this.cssPreprocessor.ext}`),
      _.template(this.cssPreprocessor.comment)({
        comment: 'Style it up in here'
      })
    );
    this.fs.write(
      this.destinationPath('src/scripts/scripts.js'),
      "'use strict'\n"
    );

    //create folders
    this.fs.copy(
      this.templatePath('gitkeep'),
      this.destinationPath('src/images/.gitkeep')
    );
    // },

    // projectfiles() {
    this.fs.copy(
      this.templatePath('editorconfig'),
      this.destinationPath('.editorconfig')
    );
    this.fs.copy(
      this.templatePath('jshintrc'),
      this.destinationPath('.jshintrc')
    );
    // }
  }

  install() {
    this.installDependencies({
      skipInstall: this.options['skip-install']
    });
  }
};
