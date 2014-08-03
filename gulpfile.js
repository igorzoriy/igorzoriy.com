"use strict";

var appPath = 'app';
var stylPath = appPath + '/styl/**/*.styl';
var tplPath = appPath + '/templates/**/*.jade';
var partTplPath = appPath + '/templates/partials/**/*.jade';
var dataPath = './' + appPath + '/data.json';
var outputPath = 'output';

var gulp = require('gulp');
var gutil = require('gulp-util');

gulp.task('server', function () {
    var connect = require('connect');
    var serveStatic = require('serve-static');
    var http = require('http');

    var port = 8008;

    connect()
        .use(serveStatic(outputPath))
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
        .pipe(gulp.dest(outputPath))
    ;
});

gulp.task('templates', function () {
    var jade = require('gulp-jade');
    var data = require('gulp-data');
    gulp.src([tplPath, '!' + partTplPath])
        .pipe(data(function () {
            return require(dataPath);
        }))
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest(outputPath));
});

gulp.task('watch', function () {
    gulp.watch(stylPath, ['stylus']);
    gulp.watch(tplPath, ['templates']);
});
