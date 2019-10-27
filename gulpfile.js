var gulp     = require('gulp'), 
plumber      = require('gulp-plumber'),
less         = require('gulp-less'),
postcss      = require('gulp-postcss'),
autoprefixer = require('autoprefixer'),
minify       = require('gulp-csso'),
imagemin     = require('gulp-imagemin'),
webp         = require('gulp-webp'),
rename       = require('gulp-rename'),
del          = require('del'),
browserSync  = require('browser-sync');

gulp.task('less', function(){ 
  return gulp.src('app/less/style.less') 
  .pipe(plumber())
  .pipe(less()) 
  .pipe(postcss([autoprefixer({
    browsers: ['last 10 versions']
  }) ]))
  .pipe(gulp.dest('app/css')) 
  .pipe(browserSync.reload({stream: true}))
  .pipe(minify())
  .pipe(rename("style.min.css"))
  .pipe(gulp.dest("app/css/"))
});

gulp.task('images', function() {
  return gulp.src("app/img/**/*.{png,jpg,svg}")
  .pipe(imagemin([
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.jpegtran({progressive: true}),
    imagemin.svgo()
    ]))
  .pipe(gulp.dest("dist/img"))
});

gulp.task("webp", ['images'], function() {
  return gulp.src('dist/img/**/*.{png,jpg}')
  .pipe(webp({quality: 90}))
  .pipe(gulp.dest('dist/img'))
});

gulp.task('browser-sync', function() {
  browserSync({ 
    server: { 
      baseDir: 'app' 
    },
    notify: false 
  });
});

gulp.task('clean', function() {
  return del.sync('dist');
});

gulp.task('watch', ['browser-sync', 'less'], function() {
  gulp.watch('app/less/**/*.less', ['less']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('build', ['clean', 'images', 'webp'], function() {

  var buildCss = gulp.src([
    'app/css/style.min.css', 
    'app/css/normalize.css'
    ])
  .pipe(gulp.dest('dist/css'))

  var buildFonts = gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))

  var buildJs = gulp.src('app/js/**/*')
  .pipe(gulp.dest('dist/js'))

  var buildHtml = gulp.src('app/*.html')
  .pipe(gulp.dest('dist'));

}); 

gulp.task('default', ['watch']);