'use strict';

const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('Static2000:content', function() {
  before(function(done) {
    helpers
      .run(path.join(__dirname, '../generators/content'))
      .withArguments(['parent-page/page-name', 'template-name'])
      .withOptions({ 'skip-install': true })
      .on('ready', function(generator) {
        generator.config.set('baseUrl', 'http://example.com');
        generator.config.set('templateEngine', 'pug');
        generator.config.set('cssPreprocessor', 'sass');
      })
      .on('end', done);
  });

  it('creates content file', function() {
    assert.file(['src/content/parent-page/page-name.pug']);
  });

  it('creates content file with correct template', function() {
    assert.fileContent(
      'src/content/parent-page/page-name.pug',
      /^template: template-name$/m
    );
  });
});
