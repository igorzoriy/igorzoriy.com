"use strict";

var port = 8008;
var appPath = './app';
var stylPath = appPath + '/styl/**/*.styl';
var tplPath = appPath + '/templates';
var imagesPath = appPath + '/images/*';
var outputPath = './output';

var del = require('del');
var fs = require('fs');

var gulp = require('gulp');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var jade = require('gulp-jade');
var gdata = require('gulp-data');
var connect = require('connect');
var serveStatic = require('serve-static');
var imagemin = require('gulp-imagemin');
var stylus = require('gulp-stylus');
var concat = require('gulp-concat');
var inlineCss = require('gulp-inline-css');
var html2pdf = require('gulp-html2pdf');
var s3 = require('gulp-s3');

var data = require(appPath + '/data.json');

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

gulp.task('images', function() {
    return gulp
        .src(imagesPath)
        .pipe(imagemin({
            optimizationLevel: 5
        }))
        .pipe(gulp.dest(outputPath + '/images'));
});

gulp.task('styles', function () {
    return gulp
        .src(stylPath)
        .pipe(plumber())
        .pipe(stylus())
        .pipe(concat('styles.css'))
        .pipe(gulp.dest(outputPath))
    ;
});

gulp.task('templates', function () {
    data.isPDF = false;

    return gulp
        .src(tplPath + '/*.jade')
        .pipe(plumber())
        .pipe(gdata(data))
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest(outputPath));
});

gulp.task('pdf', ['styles'], function () {
    data.isPDF = true;

    return gulp
        .src(tplPath + '/resume.jade')
        .pipe(plumber())
        .pipe(gdata(data))
        .pipe(jade({
            pretty: true
        }))
        .pipe(inlineCss({
            url: 'file://' + process.cwd() + '/' + outputPath + '/resume.html'
        }))
        .pipe(html2pdf({
            marginTop: 0,
            marginBottom: 0
        }))
        .pipe(gulp.dest(outputPath));
});

gulp.task('watch', function () {
    gulp.watch(stylPath, ['styles']);
    gulp.watch([tplPath + '/**/*.jade'], ['templates']);
    gulp.watch(imagesPath, ['images']);
});

gulp.task('build', ['clean', 'images', 'styles', 'pdf', 'templates']);

gulp.task('deploy', ['build', 'pdf'], function () {
    var config = JSON.parse(fs.readFileSync('aws.json'));
    var options = {
        headers: {
            'Cache-Control': 'max-age=315360000, no-transform, public'
        }
    };

    return gulp
        .src('output/**')
        .pipe(s3(config, options));
});

gulp.task('default', ['build', 'server', 'watch']);
