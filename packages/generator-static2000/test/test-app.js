'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

var deps = [
  [helpers.createDummyGenerator(), 'static2000:layout'],
  [helpers.createDummyGenerator(), 'static2000:template'],
  [helpers.createDummyGenerator(), 'static2000:content']
];

describe('static2000:app', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .inDir(path.join(os.tmpdir(), './temp-test'))
      .withGenerators(deps)
      .withArguments('test-name')
      .withOptions({ 'skip-install': true })
      .withPrompt({
        templateEngine: 'jade',
        cssPreprocessor: 'sass',
        baseUrl: 'http://example.com'
      })
      .on('end', done);
  });

  it('creates project files', function () {
    assert.file([
      'bower.json',
      'package.json',
      '.editorconfig',
      '.jshintrc',
      'gulpfile.js'
    ]);
  });

  it('creates globals file', function() {
    assert.file([
      'src/templates/includes/globals.jade'
    ]);
  });
});
