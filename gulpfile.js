'use strict';

var gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  stylish = require('jshint-stylish'),
  gulpif = require('gulp-if'),
  minifyHtml = require('gulp-minify-html'),
  source = require('vinyl-source-stream'),
  gutil = require('gulp-util'),
  browserify = require('browserify'),
  minifyCss = require('gulp-minify-css'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  browserSync = require('browser-sync').create(),
  exorcist = require('exorcist'),
  merge = require('gulp-merge-json'),
  del = require('del'),
  rev = require('gulp-rev'),
  imagemin = require('gulp-imagemin'),
  cache = require('gulp-cache'),
  revReplace = require('gulp-rev-replace');

var env,
  htmlSources,
  jsSources,
  cssSources,
  outputDir,
  appEntryPoint;

env = process.env.NODE_ENV || 'development';

jsSources = [
  'app/scripts/**/*.js',
  'gulpfile.js'
];

appEntryPoint = 'app/scripts/app.js';

htmlSources = [
  'app/*.html'
];

cssSources = [
  'app/styles/*.css'
];

outputDir = (env !== 'development') ? 'builds/production/' : 'builds/development/';
// Clean the development or the prodcution folder according to the env variable
gulp.task('clean:css', function () {
    return del([
      outputDir + 'css/**/*.css'
    ]);
});

gulp.task('clean:js', function () {
    return del([
      outputDir + 'js/**/*.js'
    ]);
});

gulp.task('clean', function () {
    return del([
      outputDir + '**/*.*'
    ]);
});
// JSHint task to helps to detect errors and potential problems in your JavaScript code.
gulp.task('jshint', function () {
	return gulp.src(jsSources)
		.pipe(jshint())
		.pipe(jshint.reporter(stylish));
});

gulp.task('fonts', function () {
	return gulp.src('./bower_components/bootstrap/dist/fonts/**/*.{ttf,woff,eof,svg}*')
		.pipe(gulp.dest(outputDir + 'fonts'));
});

function bundle (bundler) {
  return bundler
    .bundle()
    .on('error', gutil.log)
    .pipe(exorcist(outputDir + '/js/app.js.map'))
    .pipe(source('app.js'))
    .pipe(gulpif(env !== 'development', uglify()))
    .pipe(gulp.dest(outputDir + '/js/'));
}

gulp.task('js', ['clean:js'], function () {
  return bundle(browserify(appEntryPoint, {debug: true}));
});

gulp.task('css', ['clean:css'], function () {
  return gulp.src(cssSources)
    .pipe(gulpif(env !== 'development', minifyCss()))
    .pipe(concat('styles.css'))
    .pipe(gulp.dest(outputDir + 'css'));
});

gulp.task('revision:css', ['css'], function() {
  return gulp.src(outputDir + 'css/**/*.css')
    .pipe(rev())
    .pipe(gulp.dest(outputDir + 'css'))
    .pipe(rev.manifest('rev-manifest-css.json'))
    .pipe(gulp.dest(outputDir + 'rev'));
});

gulp.task('revision:js', ['js'], function() {
  return gulp.src([outputDir + 'js/**/*.js'])
    .pipe(rev())
    .pipe(gulp.dest(outputDir + 'js'))
    .pipe(rev.manifest('rev-manifest-js.json'))
    .pipe(gulp.dest(outputDir + 'rev'));
});

gulp.task('revision', ['revision:js', 'revision:css'], function() {
  return gulp.src([outputDir + 'rev/rev-manifest-css.json', outputDir + 'rev/rev-manifest-js.json'])
    .pipe(merge('rev/rev-manifest.json'))
    .pipe(gulp.dest(outputDir));
});

gulp.task('build', ['revision'], function () {
  var manifest = gulp.src(outputDir + 'rev/rev-manifest.json');
  return gulp.src('app/index.html')
    .pipe(revReplace({manifest: manifest}))
    .pipe(gulpif(env !== 'development', minifyHtml()))
    .pipe(gulp.dest(outputDir));
});

// Images
gulp.task('imagemin', function () {
	return del([outputDir + 'images']), gulp.src('app/images/**/*')
		.pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
		.pipe(gulp.dest(outputDir + 'images'));
});

gulp.task('serve', ['jshint', 'imagemin', 'fonts', 'build'], function () {
  browserSync.init({
    server: outputDir,
    logFileChanges: false,
    open: false
  });
  gulp.watch(jsSources, ['jshint']);
  gulp.watch(['app/scripts/**/*.js', cssSources, htmlSources], ['build']);
  gulp.watch(outputDir + '**/*.*').on('change', browserSync.reload);
});
