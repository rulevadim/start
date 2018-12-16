'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');

gulp.task('sass', function(){
	return gulp.src('dev/sass/*.sass')
		.pipe(sass())
		.pipe(gulp.dest('web/css'));
});

gulp.task('sprite', function() {
	var spriteData = 
		gulp.src('dev/sprite/*.png')
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
	browserSync.init({server:'web'});
	browserSync.watch('web/**/*.{html,js,css}').on('change', browserSync.reload);
});

gulp.task('default', gulp.series('sprite', 'sass', gulp.parallel('watch', 'server')));