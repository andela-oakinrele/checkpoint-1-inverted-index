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

gulp.task('babel', () => {
  // create main bundle
  browserify(['src/inverted-index.js', 'src/app.js'])
    .transform(babel, { presets: ['es2015'] })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./src/dist'));

  // create test bundle
  browserify(['src/inverted-index.js', 'spec/inverted-index.spec.js'])
    .transform(babel, { presets: ['es2015'] })
    .bundle()
    .pipe(source('test-bundle.js'))
    .pipe(gulp.dest('./spec'));
  return true;
});

gulp.task('default', ['browser-sync', 'jasmine', 'babel']);
