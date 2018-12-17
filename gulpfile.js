'use strict';

const gulp        = require('gulp');
const sass        = require('gulp-sass');
const bs          = require('browser-sync');
const spritesmith = require('gulp.spritesmith');
const merge       = require('merge-stream');

gulp.task('sass', function(){
	return gulp.src('dev/sass/*.sass')
		.pipe(sass())
		.pipe(gulp.dest('web/css'));
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

gulp.task('watch', function(){
	gulp.watch('dev/sass/*.sass', gulp.series('sass'));
});

gulp.task('server', function(){
	bs.init({server:'web'});
	bs.watch('web/**/*.{html,js,css}').on('change', bs.reload);
});

gulp.task('default', gulp.series('sprite', 'sass', gulp.parallel('watch', 'server')));