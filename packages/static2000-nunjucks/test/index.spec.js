const nunjucksAdapter = require('../index');
require('chai').should();

describe('nunjucks adapter', function() {
  it('should render simple template', function() {
    var rendered = nunjucksAdapter.render('<p>Test string</p>', {
      filename: 'test/templates/simple-template.html'
    });
    console.log(rendered);
    rendered.should.equal('<p>Test string</p>');
  });

  it('should compile simple template', function() {
    var compiled = nunjucksAdapter.compile('<p>Test string</p>', {
      filename: 'test/templates/simple-template.html'
    });
    var rendered = compiled({});
    rendered.trim().should.equal('<p>Test string</p>'); //have to trim because prepended newline
  });

  it('should use locals', function() {
    var compiled = nunjucksAdapter.compile('<p>{{ variable }}</p>', {
      filename: 'test/templates/simple-template.html'
    });
    var rendered = compiled({
      variable: 'Test string'
    });
    rendered.trim().should.equal('<p>Test string</p>');
  });

  it('should extend a layout', function() {
    var compiled = nunjucksAdapter.compile(
      `{% extends "./layouts/default.html" %}
      {% block title %}Test title{% endblock %}
      {% block body %}Test body{% endblock %}`,
      {
        filename: 'test/templates/use-layout.html'
      }
    );
    var rendered = compiled({});
    rendered.trim().should.equal(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Test title</title>
  </head>
  <body>
    Test body
  </body>
</html>`);
  });

  it('should use macros', function() {
    var template = nunjucksAdapter.globalsInclude + '{{ globals.test() }}';
    var compiled = nunjucksAdapter.compile(template, {
      filename: 'test/templates/macro-template.html'
    });
    var rendered = compiled({});
    rendered.trim().should.equal('<p>Test macro</p>');
  });

  it('should use macros and a template', function() {
    var compiled = nunjucksAdapter.compile(
      nunjucksAdapter.globalsInclude +
        `{% extends "./layouts/default.html" %}
      {% block title %}Test title{% endblock %}
      {% block body %}{{ globals.test() }}{% endblock %}`,
      {
        filename: 'test/templates/use-layout.html'
      }
    );
    var rendered = compiled({});
    rendered.trim().should.equal(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Test title</title>
  </head>
  <body>
    
<p>Test macro</p>

  </body>
</html>`);
  });
});
