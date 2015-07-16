'use strict';

var gulp = require('gulp');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
//var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var mocha = require('gulp-mocha');

var src_js = './underscore-observe.js';
var demo_js = './demo/js/todo.js';
var tests_js = './test/mocha.js';
var all_js = [src_js, demo_js, tests_js];


var onError = function(err) {
    console.log(err.toString());
    this.emit('end');
};

/* ################################################################
 * META TASKS
 * ################################################################ */

gulp.task('default', ['lint:js', 'test:js']);


gulp.task('watch', ['default'], function() {
    gulp.watch(all_js, ['lint:js', 'test:js']);
});


/* ################################################################
 * JAVASCRIPT TASKS
 * ################################################################ */

gulp.task('lint:js', ['jscs', 'jshint']);
gulp.task('test:js', ['mocha']);


gulp.task('jscs', function() {
    return gulp.src(all_js)
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(jscs());
});


gulp.task('jshint', function() {
    return gulp.src(all_js)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'));
});


gulp.task('mocha', function() {
    return gulp.src(tests_js, {read: false})
        .pipe(mocha());
});
