var gulp = require('gulp'),
	 jade = require('gulp-jade'),
	 uglify = require('gulp-uglify'),
	 gulpif = require('gulp-if'),
	 sass = require('gulp-sass'),
    concat = require('gulp-concat'),
	 sourcemaps = require('gulp-sourcemaps'),
	 browserSync = require('browser-sync');

var env = process.env.NODE_ENV || 'development';
var outputDir = 'builds/development';

gulp.task('jade', function(){
	return gulp.src('src/templates/*.jade')
		.pipe(jade())
		.pipe(gulp.dest(outputDir));
});

gulp.task('js', function(){
	gulp.src([
      './bower_components/jquery/dist/jquery.js',
      './bower_components/foundation/js/foundation.js',
      './bower_components/foundation/js/foundation.alert.js',
      './src/js/main.js'
   ])		
		.pipe(sourcemaps.init())
      .pipe(concat('main.js'))
		.pipe(gulpif(env === 'production', uglify()))
		.pipe(gulpif(env === 'development', sourcemaps.write()))
		.pipe(gulp.dest(outputDir + '/js'));
   return gulp.src('./bower_components/modernizr/modernizr.js')
      .pipe(gulp.dest(outputDir + '/js'));
});

gulp.task('sass', function(){
	var style;
	if(env === 'development'){
		style = 'map';
	}
	if(env === 'production'){
		style = 'compressed';
	}
	return gulp.src('src/sass/*.scss')
      .pipe(sourcemaps.init())
      .pipe(sass({includePaths: ['./bower_components/foundation/scss']},{outputStyle : style}).on('error', sass.logError))
      .pipe(concat('main.css'))
      .pipe(gulpif(env === 'development', sourcemaps.write()))
      .pipe(gulp.dest( outputDir + '/css'));
});

gulp.task('reloadBrowser',['jade','js','sass'], browserSync.reload);

gulp.task('watch', function(){
	browserSync({
		server:{
			baseDir: 'builds/development'
		}
	})
	gulp.watch('src/templates/**/*.jade', ['reloadBrowser']);
	gulp.watch('src/js/main.js', ['reloadBrowser']);
	gulp.watch('src/sass/**/*.scss', ['reloadBrowser']);
});

gulp.task('default', ['jade', 'js', 'sass', 'reloadBrowser', 'watch']);