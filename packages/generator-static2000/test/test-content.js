'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('Static2000:content', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/content'))
      .withArguments(['parent-page/page-name', 'template-name'])
      .withOptions({ 'skip-install': true })
      .on('ready', function(generator) {
        generator.config.set('baseUrl', 'http://example.com');
        generator.config.set('templateEngine', 'jade');
        generator.config.set('cssPreprocessor', 'sass');
      })
      .on('end', done);
  });

  it('creates content file', function () {
    assert.file([
      'src/content/parent-page/page-name.jade'
    ]);
  });

  it('creates content file with correct template', function() {
    assert.fileContent('src/content/parent-page/page-name.jade', /^template: template-name$/m);
  });
});
