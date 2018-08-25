const gulp          = require('gulp');
const clean         = require('gulp-clean');
const runSequence   = require('run-sequence');
const browserify    = require('browserify');
const source        = require('vinyl-source-stream');
const tsify         = require('tsify');
const sourcemaps    = require('gulp-sourcemaps');
const buffer        = require('vinyl-buffer');
const exec        = require('child_process').exec;

gulp.task('copyHtml', function () {
    return gulp.src(['public/*.html'])
      .pipe(gulp.dest('dist'));
});

gulp.task('clean-dist', function () {
  return gulp.src(['dist/**'], { read: false })
    .pipe(clean());
});

gulp.task('pre-run', function () {
  runSequence('clean-dist', 'tsc', 'test', 'copyHtml');
});

gulp.task('compile', ['pre-run'], function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['ts/src/main.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .transform('babelify', {
        presets: ['es2015'],
        extensions: ['.ts']
    })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist'));
});

gulp.task('tsc', function () {
  return exec('tsc');
})

gulp.task('test', function () {
  return exec('ava');
})

gulp.task('default', ['compile'], function () {
  gulp.watch([ 'src/*', 'src/**/*', 'public/*' ], ['compile']);
});

