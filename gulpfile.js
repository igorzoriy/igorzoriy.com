"use strict";

var appPath = 'app';
var stylPath = appPath + '/styl/*.styl';

var gulp = require('gulp');
var gutil = require('gulp-util');

gulp.task('server', function () {
    var connect = require('connect');
    var serveStatic = require('serve-static');
    var http = require('http');

    var port = 8008;

    connect()
        .use(serveStatic(appPath))
        .listen(port)
    ;
    gutil.log(gutil.colors.yellow('Server started at http://localhost:' + port));
});

gulp.task('stylus', function () {
    var stylus = require('gulp-stylus');
    var rename = require('gulp-rename');
    gulp
        .src(stylPath)
        .pipe(stylus())
        .pipe(rename('styles.css'))
        .pipe(gulp.dest(appPath))
    ;
});

gulp.task('watch', function () {
    gulp.watch(stylPath, ['stylus']);
});
