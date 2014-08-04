"use strict";

var appPath = 'app';
var stylPath = appPath + '/styl/**/*.styl';
var tplPath = appPath + '/templates/*.jade';
var partTplPath = appPath + '/templates/partials/*.jade';
var dataPath = './' + appPath + '/data.json';
var imagesPath = appPath + '/images/*';
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

gulp.task('clean', function () {
    var del = require('del');
    del.sync([
            outputPath + '/**/*',
            '!' + outputPath + '/.gitkeep'
    ]);
});

gulp.task('images', function() {
    var imagemin = require('gulp-imagemin');
    return gulp
        .src(imagesPath)
        .pipe(imagemin({
            optimizationLevel: 5
        }))
        .pipe(gulp.dest(outputPath + '/images'));
});

gulp.task('styles', function () {
    var stylus = require('gulp-stylus');
    var concat = require('gulp-concat');
    return gulp
        .src(stylPath)
        .pipe(stylus())
        .pipe(concat('styles.css'))
        .pipe(gulp.dest(outputPath))
    ;
});

gulp.task('templates', function () {
    var jade = require('gulp-jade');
    var data = require('gulp-data');
    return gulp
        .src(tplPath)
        .pipe(data(function () {
            return require(dataPath);
        }))
        .pipe(jade())
        .pipe(gulp.dest(outputPath));
});

gulp.task('watch', function () {
    gulp.watch(stylPath, ['styles']);
    gulp.watch([tplPath, partTplPath], ['templates']);
    gulp.watch(imagesPath, ['images']);
});

gulp.task('build', ['clean', 'images', 'styles', 'templates']);

gulp.task('deploy', ['build'], function () {
    var fs = require('fs');
    var s3 = require('gulp-s3');
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
