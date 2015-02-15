'use strict';

var expect = require('chai').expect;
var loadPlugins = require('../lib/loadPlugins');

var testOptions = {
    isTrue: true,
    isFalse: false
};

var testState = {
    contentList: [
        { fakeContent: true }
    ]
};

describe('loadPlugins', function() {

    it('should call plugin functions with options (object) and content list (array)', function() {
        loadPlugins({
            lazy: false,
            config: {
                devDependencies: {
                    'should-not-be-loaded': '^0.0.1',
                    'static2000-global-should-be-loaded': '^0.0.0'
                }
            },
            requireFn: function(name) {
                return function(options, contentList) {
                    expect(options).to.equal(testOptions);
                    expect(contentList).to.equal(testState.contentList);
                    return 'fake plugin';
                }
            }
        }, testOptions, testState);
    });


    it('should not load plugins with wrong name', function() {
        var plugins = loadPlugins({
            lazy: false,
            config: {
                devDependencies: {
                    'should-not-be-loaded': '^0.0.1',
                    'static2000-global-should-be-loaded': '^0.0.0'
                }
            },
            requireFn: function(name) {
                return function(options, contentList) {
                    return 'fake plugin';
                }
            }
        }, testOptions, testState);

        expect(plugins).to.have.property('shouldBeLoaded');
        expect(plugins).to.not.have.property('shouldNotBeLoaded');
    });



});
