const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const jasmineBrowser = require('gulp-jasmine-browser');
const watch = require('gulp-watch');
const browserify = require('browserify');
const babel = require('babelify');
const source = require('vinyl-source-stream');

gulp.task('browser-sync', () => {
  browserSync.init({
    server: {
      baseDir: './'
    },
    files: ['assets/css/*.css', 'src/*.js', '*.html']
  });
});

gulp.task('jasmine', () => {
  const filesForTest = ['src/*.js', 'spec/*.js'];
  return gulp.src(filesForTest)
    .pipe(watch(filesForTest))
    .pipe(jasmineBrowser.specRunner())
    .pipe(jasmineBrowser.server({ port: 8888 }));
});

gulp.task('babel', () => browserify(['src/inverted-index.js', 'src/app.js'])
  .transform(babel, { presets: ['es2015'] })
  .bundle()
  .pipe(source('app.js'))
  .pipe(gulp.dest('./src/dist')));

gulp.task('babel-test', () => browserify(['spec/inverted-index-test.js'])
  .transform(babel, { presets: ['es2015'] })
  .bundle()
  .pipe(source('app.js'))
  .pipe(gulp.dest('./spec/dist')));

gulp.task('watch', () => {
  gulp.watch(['src/*.js', 'spec/*.js'], ['babel']);
});

gulp.task('default', ['browser-sync', 'jasmine', 'babel', 'babel-test']);
