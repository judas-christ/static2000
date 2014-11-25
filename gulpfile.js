'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');

var src = ['index.js','lib/*.js'];

gulp.task('jshint', function() {
    return gulp.src(src)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('default', ['jshint'], function() {
    gulp.watch(['index.js','lib/*.js'], ['jshint']);
});
