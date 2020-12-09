var expect = require('chai').expect;
var findParent = require('../lib/findParent');

var contentMap = {
  '/': { path: '/', name: 'root' },
  '/page-1/': { path: '/page-1/', name: 'page 1' },
  '/page-1/page-2/': { path: '/page-1/page-2/', name: 'page 2' }
};

describe('findParent', function() {

  it('should not find a parent in an empty map', function() {
    var map = {};
    var parent = findParent(map, '/');
    expect(parent).to.be.not.ok;
  });

  it('should find a parent for a root page', function() {
    var parent = findParent(contentMap, '/test');
    expect(parent).to.equal(contentMap['/']);
  });

  it('should find a parent for a sub page', function() {
    var parent = findParent(contentMap, '/page-1/test/');
    expect(parent).to.equal(contentMap['/page-1/']);
  });

  it('should not find a parent for path that does not exist', function() {
    var parent = findParent(contentMap, '/this-page-does-not-exist/test');
    expect(parent).to.be.not.ok;
  });
});
