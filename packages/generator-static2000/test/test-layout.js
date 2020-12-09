'use strict';

const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('Static2000:layout', function() {
  before(function(done) {
    helpers
      .run(path.join(__dirname, '../generators/layout'))
      .withArguments('layout-name')
      .withOptions({ 'skip-install': true })
      .on('ready', function(generator) {
        generator.config.set('baseUrl', 'http://example.com');
        generator.config.set('templateEngine', 'pug');
        generator.config.set('cssPreprocessor', 'sass');
      })
      .on('end', done);
  });

  it('creates layout file', function() {
    assert.file(['src/templates/layouts/layout-name.pug']);
  });
});
