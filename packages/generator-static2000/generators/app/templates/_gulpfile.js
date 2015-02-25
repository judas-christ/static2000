// Gulp and plugins
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

// Static2000
var static2000 = require('static2000');

// Other node packages
var del = require('del');
var browserSync = require('browser-sync');

// Environment
var isDev = ($.util.env.type || '').indexOf('dev') === 0;


// Tasks
gulp.task('clean', function(cb) {
  del('www', cb);
});



gulp.task('styles', function() {
  return gulp.src('src/styles/*.<%= cssPreprocessor.glob %>')
    .pipe($.<%= cssPreprocessor.name %>())
    .pipe($.autoprefixer())
    .pipe(isDev ? $.util.noop() : $.csso())
    .pipe(gulp.dest('www/styles'))
    .pipe(browserSync.reload({ stream: true }));
});



gulp.task('scripts', function() {
  return gulp.src('src/scripts/*.js')
    .pipe(isDev ? $.util.noop() : $.uglify())
    .pipe(gulp.dest('www/scripts'));
});



gulp.task('images', function() {
  return gulp.src('src/images/**/*.{svg,png,gif,jpg,jpeg}')
    .pipe(gulp.dest('www/images'));
})



gulp.task('serve', function() {
  browserSync({
    server: {
      baseDir: 'www'
    }
  });
});



gulp.task('static2000', function() {
  return static2000({
      baseUrl: <%= baseUrl %>,
      templateAdapter: '<%= templateEngine.adapter %>'
    })
    .pipe(gulp.dest('www'));
});



gulp.task('build', ['styles', 'scripts', 'images', 'static2000']);



gulp.task('default', ['build', 'serve'], function() {
  gulp.watch('src/styles/**/*.<%= cssPreprocessor.glob %>', ['styles']);
  gulp.watch('src/scripts/**/*.js', ['scripts', browserSync.reload]);
  gulp.watch('src/**/*.<%= templateEngine.glob %>', ['static2000', browserSync.reload]);
});
