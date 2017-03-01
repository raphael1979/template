var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var uglyfly = require('gulp-uglyfly');
var cleanCSS = require('gulp-clean-css');
var jshint = require('gulp-jshint');
 

// watch files for changes and reload
gulp.task('serve', function() {
  browserSync({
    server: {
      baseDir: 'app'
    }
  });

  gulp.watch(['*.html', 'styles/**/*.css', 'scripts/**/*.js'], {cwd: 'app'}, reload);
});


gulp.task('css', function () {
  return gulp.src(source + '/assets/css/styles.scss')
    .pipe(plugins.sass())
    .pipe(plugins.cssbeautify({indent: '  '}))
    .pipe(plugins.autoprefixer())
    .pipe(gulp.dest(destination + '/assets/css/'));
});   

gulp.task('compress-js', function() {
  gulp.src('app/*.js')
    .pipe(uglyfly())
    .pipe(gulp.dest('dist'))
});

gulp.task('minify-css', function() {
  return gulp.src('css/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist'));
});

 
const map = require('map-stream');

const myReporter = map(function (file, cb) {
  if (file.jshint.success) {
    return cb(null, file);
  }

  console.log('JSHINT fail in', file.path);
  file.jshint.results.forEach(function (result) {
    if (!result.error) {
      return;
    }

    const err = result.error
    console.log(`  line ${err.line}, col ${err.character}, code ${err.code}, ${err.reason}`);
  });

  cb(null, file);
});

gulp.task('lint', function() {
  return gulp.src('app/*.js')
    .pipe(jshint())
    .pipe(myReporter);
});




gulp.task('default', function() {
  // place code for your default task here
});

