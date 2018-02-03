

var filterContentList = require('../lib/filterContentList');
var expect = require('chai').expect;
var _ = require('lodash');

function getTestList(length) {
  var list = [];
  list.push({ path: '/', name: 'root', visible: true })
  for(var i=0;i<length;i++) {
    list.push({ path: '/page-'+i, name: 'page '+i, visible: i%2 == 0 });
  }
  return list;
}

describe('filterContentList', function() {

  it('should return a copy of the list when no filter is supplied', function() {
    var list = getTestList(10);
    var filtered = filterContentList(list);
    expect(filtered).to.deep.equal(list);
    expect(filtered).to.not.equal(list);
  });

  it('should filter on properties when the filter is an object', function() {
    var list = getTestList(10);
    var filtered = filterContentList(list, {visible: true});
    expect(filtered).to.satisfy(function(l) { return _.every(l, {visible:true}); });
  });

  it('should return an empty list when filtering out all pages', function() {
    var list = getTestList(10);
    var filtered = filterContentList(list, {nonexistant: 'nonexistant'});
    expect(filtered).to.be.empty;
  });

  it('should filter with a function', function() {
    var list = getTestList(10);
    var filtered = filterContentList(list, function(item) { return item.name === 'page 2'; });
    expect(filtered.length).to.equal(1);
  })
});
