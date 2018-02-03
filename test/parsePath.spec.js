

var expect = require('chai').expect;
var parsePath = require('../lib/parsePath');

describe('parsePath', function() {

  it('should parse root index', function() {
    var path = 'index.jade';
    var parsed = parsePath(path, '.jade');
    expect(parsed.path).to.equal('/');
  });

  it('should parse folder', function() {
    var path = 'folder/index.jade';
    var parsed = parsePath(path, '.jade');
    expect(parsed.path).to.equal('/folder/');
  });

  it('should parse subfolder', function() {
    var path = 'folder/subfolder/index.jade';
    var parsed = parsePath(path, '.jade');
    expect(parsed.path).to.equal('/folder/subfolder/');
  });

  it('should parse filename', function() {
    var path = 'filename.jade';
    var parsed = parsePath(path, '.jade');
    expect(parsed.path).to.equal('/filename/');
  });

  it('should parse filename in folder', function() {
    var path = 'folder/filename.jade';
    var parsed = parsePath(path, '.jade');
    expect(parsed.path).to.equal('/folder/filename/');
  });

  it('should parse order in filename', function() {
    var path = '010-index.jade';
    var parsed = parsePath(path, '.jade');
    expect(parsed.order).to.equal(10);
    expect(parsed.path).to.equal('/');
  });

  it('should parse order in filename in folder', function() {
    var path = 'folder/01-index.jade';
    var parsed = parsePath(path, '.jade');
    expect(parsed.order).to.equal(1);
    expect(parsed.path).to.equal('/folder/');
  });

  it('should parse order in filename in subfolder', function() {
    var path = 'folder/subfolder/10-filename.jade';
    var parsed = parsePath(path, '.jade');
    expect(parsed.order).to.equal(10);
    expect(parsed.path).to.equal('/folder/subfolder/filename/');
  });
});
