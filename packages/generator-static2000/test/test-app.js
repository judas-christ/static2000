const path = require('path');
const helpers = require('yeoman-test');
const assert = require('yeoman-assert');
const os = require('os');

const deps = [
  [helpers.createDummyGenerator(), 'static2000:layout'],
  [helpers.createDummyGenerator(), 'static2000:template'],
  [helpers.createDummyGenerator(), 'static2000:content']
];

describe('static2000:app', function() {
  before(function(done) {
    helpers
      .run(path.join(__dirname, '../generators/app'))
      .inDir(path.join(os.tmpdir(), './temp-test'))
      .withGenerators(deps)
      .withArguments('test-name')
      .withOptions({ 'skip-install': true })
      .withPrompts({
        templateEngine: 'pug',
        cssPreprocessor: 'sass',
        baseUrl: 'http://example.com'
      })
      .on('end', done);
  });

  it('creates project files', function() {
    assert.file([
      'bower.json',
      'package.json',
      '.editorconfig',
      '.jshintrc',
      'gulpfile.js'
    ]);
  });

  it('creates globals file', function() {
    assert.file(['src/templates/includes/globals.pug']);
  });
});
