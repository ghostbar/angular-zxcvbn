/* jshint strict: false */

// Gulp plugins
var gulp = require('gulp');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

// Orher libraries
var del = require('del');
var Server = require('karma').Server;
var runSequence = require('run-sequence');


var srcFiles = ['./src/*.js'];
var testFiles = ['./test/*.js'];
var srcAndTestFiles = srcFiles.concat(testFiles);

gulp.task('default', function(callback) {
  runSequence('test', 'clean', 'jshint', 'concat', callback);
});

gulp.task('clean', function() {
  return del(['dist']);
});

gulp.task('concat', function() {
  return gulp.src(srcFiles)
    .pipe(concat('angular-zxcvbn.js'))
    .pipe(gulp.dest('dist'))
    .pipe(rename('angular-zxcvbn.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('jshint', function() {
  return gulp.src(srcAndTestFiles)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('watch', function() {
  return gulp.watch(srcAndTestFiles, ['default']);
});

gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('test-saucelabs', function (done) {
  new Server({
    configFile: __dirname + '/karma-saucelabs.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('tdd', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js'
  }, done).start();
});
