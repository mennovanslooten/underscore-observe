'use strict';

var gulp = require('gulp');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
//var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
//var mocha = require('gulp-mocha');


var onError = function(err) {
    console.log(err.toString());
    this.emit('end');
};

/* ################################################################
 * META TASKS
 * ################################################################ */

gulp.task('default', ['build:js']);


gulp.task('watch', ['default'], function() {
    gulp.watch('./src/**/*.js', ['build:js']);
});


/* ################################################################
 * JAVASCRIPT TASKS
 * ################################################################ */

gulp.task('build:js', ['lint:js', /* 'test:js', */]);
gulp.task('lint:js', ['jscs', 'jshint']);
//gulp.task('test:js', [[>'flow', <] 'mocha']);


gulp.task('jscs', function() {
    return gulp.src('./src/**/*.js')
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(jscs());
});


gulp.task('jshint', function() {
    return gulp.src('./src/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'));
});


//gulp.task('mocha', function(cb) {
    //return gulp.src('./test/mocha/*.js', {read: false})
        //.pipe(mocha({reporter: 'mocha-silent-reporter'}));
//});


