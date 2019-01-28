'use strict';

const gulp        = require('gulp');
const sass        = require('gulp-sass');
const bs          = require('browser-sync');
const spritesmith = require('gulp.spritesmith');
const merge       = require('merge-stream');
const gcmq        = require('gulp-group-css-media-queries');
const newer       = require('gulp-newer');
const autoprefix  = require('gulp-autoprefixer');


let site = ''
// let proxy = 'http://' + site + '/';
let webPath = 'D:/OpenServer/OSPanel/domains/' + site;
let path = {
	sass: 'dev/sass',
	css: webPath + '/css',
	web: 'web'
};

gulp.task('sass', function(){
	return gulp.src(path.sass + '/*.sass')
		.pipe(sass())
		.pipe(autoprefix())
		.pipe(gcmq())
		.pipe(gulp.dest(path.css));
});

gulp.task('sprite', function() {
	var spriteData = 
		gulp.src('dev/sprite/*.{png,jpg,jpeg}')
			.pipe(spritesmith({
				imgName: 'sprite.png',
				cssName: '_sprite.sass',
				cssTemplate: 'sass.sprite.output.options'
			}));
	var imgStream = spriteData.img
		.pipe(gulp.dest('web/css'));
	var cssStream = spriteData.css
		.pipe(gulp.dest('dev/sass'));
	return merge(imgStream, cssStream);
});

gulp.task('toserver', function(){
	return gulp.src(path.web + '/**/*.*')
		.pipe(newer(webPath))
		.pipe(gulp.dest(webPath));
});

gulp.task('watch', function(){
	gulp.watch(path.web + '/**/*.*', gulp.series('toserver'));
	gulp.watch(path.sass + '/*.sass', gulp.series('sass'));
	gulp.watch('dev/sprite/*.{png,jpg,jpeg}', gulp.series('sprite'));
});

gulp.task('server', function(){
	if (proxy) {
		bs.init({proxy: proxy});
	} else {
		bs.init({server: webPath});
	}

	bs.watch(webPath + '/**/*.{php,html,js,css}').on('change', bs.reload);
});

gulp.task('default', gulp.series('toserver', 'sprite', 'sass', gulp.parallel('watch', 'server')));