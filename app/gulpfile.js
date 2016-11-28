var gulp		= require('gulp'),
	gutil		= require('gulp-util'),
	config		= require('./config/gulp')(),
	flatten		= require('gulp-flatten'),
	concat		= require('gulp-concat'),
	htmlMin		= require('gulp-htmlmin'),
	html2js		= require('gulp-html2js'),
	cssMin		= require('gulp-clean-css'),
	cssPrefixer	= require('gulp-autoprefixer'),
	jsMin		= require('gulp-minify'),
	inlinesource = require('gulp-inline-source');

gulp.task('template', ['style', 'script'], function(){
	return gulp.src(`${config.src.template}/*.html`)
	.pipe(inlinesource({compress: false}))
	.pipe(htmlMin({collapseWhitespace: true}))
	.pipe(gulp.dest(`${config.dest.view}`));
})

gulp.task('page', function(){
  gulp.src(`${config.src.template}/page/*.html`)
  	.pipe(htmlMin({collapseWhitespace: true}))
    .pipe(html2js('page.js', {name:'template', base:'xte', useStrict:true, rename: function (moduleName) {
    		moduleName = moduleName.substring(moduleName.lastIndexOf('/'))
			return 'view' + moduleName.replace('.html', '');
		}
	}))
    .pipe(concat('4#page-min.js'))
    .pipe(flatten())
    .pipe(gulp.dest(`${config.src.script}`))
})

gulp.task('style', function(){
	return gulp.src(`${config.src.style}/*.css`)
	.pipe(cssPrefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
	.pipe(concat('style-min.css'))
	.pipe(cssMin({keepSpecialComments : 0}, {compatibility: 'ie8'}))
	.pipe(gulp.dest(`${config.dest.dist}`));
})

gulp.task('script', ['page'], function(){
	return gulp.src(`${config.src.script}/*.js`)
	.pipe(concat('script.js'))
	.pipe(jsMin({mangle: 0, ignoreFiles: ['min.js']}))
	.pipe(gulp.dest(`${config.dest.dist}`));
})

gulp.task('default', ['template']);