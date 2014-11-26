'use strict';

var expect = require('chai').expect;
var createSitemapNodeFactory = require('../lib/createSitemapNode');

describe('createSitemapNode', function() {

    it('should use baseUrl', function() {
        var baseUrl = "http://www.test.com/root";
        var createSitemapNode = createSitemapNodeFactory(baseUrl);
        var fakeContentObject = { path: '/fake-path', modified: new Date() }
        var sitemapNode = createSitemapNode(fakeContentObject);
        expect(sitemapNode).to.contain('<loc>http://www.test.com/root/');
    });

    it('should create correct path', function() {
        var baseUrl = "http://www.test.com/root";
        var createSitemapNode = createSitemapNodeFactory(baseUrl);
        var fakeContentObject = { path: '/fake-path', modified: new Date() }
        var sitemapNode = createSitemapNode(fakeContentObject);
        expect(sitemapNode).to.contain('<loc>http://www.test.com/root/fake-path</loc>');
    });

    it('should use modified date', function() {
        var baseUrl = "http://www.test.com/root";
        var createSitemapNode = createSitemapNodeFactory(baseUrl);
        var modifiedDate = new Date(2014, 0, 1, 12, 12, 12);
        var fakeContentObject = { path: '/fake-path', modified: modifiedDate }
        var sitemapNode = createSitemapNode(fakeContentObject);
        expect(sitemapNode).to.contain('<lastmod>2014-01-01T11:12:12.000Z</lastmod>');
    });

});
