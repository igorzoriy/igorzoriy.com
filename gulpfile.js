"use strict";

var port = 8008;
var appPath = './app';
var outputPath = './output';

var del = require('del');

var gulp = require('gulp');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var jade = require('gulp-jade');
var connect = require('connect');
var serveStatic = require('serve-static');
var stylus = require('gulp-stylus');
var ghPages = require('gulp-gh-pages');

gulp.task('server', function () {
    connect()
        .use(serveStatic(outputPath))
        .listen(port)
    ;
    gutil.log(gutil.colors.yellow('Server started at http://localhost:' + port));
});

gulp.task('clean', function () {
    del.sync([
            outputPath + '/**/*',
            '!' + outputPath + '/.gitkeep'
    ]);
});

gulp.task('styles', function () {
    return gulp
        .src(appPath + '/styles.styl')
        .pipe(plumber())
        .pipe(stylus())
        .pipe(gulp.dest(outputPath))
    ;
});

gulp.task('html', function () {
    return gulp
        .src(appPath + '/index.jade')
        .pipe(plumber())
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest(outputPath));
});

gulp.task('cname', function () {
    return gulp
        .src(appPath + '/CNAME', {base: appPath})
        .pipe(gulp.dest(outputPath));
});

gulp.task('watch', function () {
    gulp.watch(appPath + '/styles.styl', ['styles']);
    gulp.watch(appPath + '/index.jade', ['html']);
});

gulp.task('build', ['clean', 'styles', 'html', 'cname']);

gulp.task('deploy', ['build'], function () {
    return gulp
        .src('output/**/*')
        .pipe(ghPages());
});

gulp.task('default', ['build', 'server', 'watch']);
