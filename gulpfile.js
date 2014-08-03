"use strict";

var appPath = 'app';
var stylPath = appPath + '/styl/**/*.styl';
var tplPath = appPath + '/templates/**/*.jade';

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
    var concat = require('gulp-concat');
    gulp
        .src(stylPath)
        .pipe(stylus())
        .pipe(concat('styles.css'))
        .pipe(gulp.dest(appPath))
    ;
});

gulp.task('templates', function () {
    var jade = require('gulp-jade');
    gulp.src(tplPath)
      .pipe(jade())
      .pipe(gulp.dest('output'))
    ;
});

gulp.task('watch', function () {
    gulp.watch(stylPath, ['stylus']);
    gulp.watch(tplPath, ['templates']);
});
