

var stateFactory = require('../lib/state');
var expect = require('chai').expect;

describe('state', function() {

  it('has properties templatesMap, contentTree, contentMap, contentList, model', function() {
    var state = stateFactory();
    expect(state).to.contain.keys('templatesMap', 'contentTree', 'contentMap', 'contentList', 'model');
  });

  it('is emptied by reset()', function() {
    var state = stateFactory();
    state.templatesMap['testTemplate'] = 'fake template';
    var fakeRoot = { path:'/', name:'fakeModel' };
    state.contentTree = fakeRoot;
    state.contentMap['/'] = fakeRoot;
    state.contentList.push(fakeRoot);
    state.model = fakeRoot;
    state.reset();
    expect(state.templatesMap).to.be.empty;
    expect(state.contentTree).to.be.undefined;
    expect(state.contentMap).to.be.empty;
    expect(state.contentList).to.be.empty;
    expect(state.model).to.be.undefined;
  });

});
