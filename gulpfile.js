'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');

var src = ['index.js','lib/*.js'];

gulp.task('jshint', function() {
    return gulp.src(src)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .on('error', gutil.log);
});

gulp.task('mocha', function() {
    return gulp.src('test/*.js', {read: false})
        .pipe(mocha())
        .on('error', gutil.log);
});

gulp.task('default', ['jshint', 'mocha'], function() {
    gulp.watch(['index.js','lib/*.js','test/*.js'], ['jshint', 'mocha']);
});