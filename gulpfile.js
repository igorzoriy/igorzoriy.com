"use strict";

var appPath = 'app';
var stylPath = appPath + '/styl/**/*.styl';
var tplPath = appPath + '/templates/*.jade';
var partTplPath = appPath + '/templates/partials/*.jade';
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

gulp.task('styles', function () {
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
    gulp.src(tplPath)
        .pipe(data(function () {
            return require(dataPath);
        }))
        .pipe(jade())
        .pipe(gulp.dest(outputPath));
});

gulp.task('watch', function () {
    gulp.watch(stylPath, ['styles']);
    gulp.watch([tplPath, partTplPath], ['templates']);
});

gulp.task('build', ['styles', 'templates']);

gulp.task('default', ['build', 'server', 'watch']);
