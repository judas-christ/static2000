const pugAdapter = require('../index');
const should = require('should');

describe('pug adapter', function() {
  it('should render simple template', function() {
    var rendered = pugAdapter.render('p Test string', {});
    rendered.should.equal('<p>Test string</p>');
  });

  it('should compile simple template', function() {
    var compiled = pugAdapter.compile('p Test string', {
      filename: 'test/templates/simple-template.pug'
    });
    var rendered = compiled({});
    rendered.trim().should.equal('<p>Test string</p>'); //have to trim because prepended newline
  });

  it('should use locals', function() {
    var compiled = pugAdapter.compile('p= variable', {
      filename: 'test/templates/simple-template.pug'
    });
    var rendered = compiled({
      variable: 'Test string'
    });
    rendered.trim().should.equal('<p>Test string</p>');
  });

  it('should extend a layout', function() {
    var compiled = pugAdapter.compile(
      `extends ./layouts/default.pug
block title
  | Test title

block body
  | Test body`,
      {
        filename: 'test/templates/use-layout.pug'
      }
    );
    var rendered = compiled({});
    rendered.trim().should.equal(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Test title
    </title>
  </head>
  <body>Test body
  </body>
</html>`);
  });

  it('should use mixins', function() {
    var template = pugAdapter.globalsInclude + '+test-mixin';
    var compiled = pugAdapter.compile(template, {
      filename: 'test/templates/mixin-template.pug'
    });
    var rendered = compiled({});
    rendered.trim().should.equal('<p>Test mixin</p>');
  });

  it('should use mixins and a template', function() {
    var compiled = pugAdapter.compile(
      pugAdapter.globalsInclude +
        `extends ./layouts/default.pug
block title
  | Test title

block body
  +test-mixin`,
      {
        filename: 'test/templates/use-layout.pug'
      }
    );
    var rendered = compiled({});
    rendered.trim().should.equal(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Test title
    </title>
  </head>
  <body>
    <p>Test mixin</p>
  </body>
</html>`);
  });
});
