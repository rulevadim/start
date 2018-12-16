'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');

gulp.task('sass', function(){
	return gulp.src('dev/sass/*.sass')
		.pipe(sass())
		.pipe(gulp.dest('web/css'));
});

gulp.task('watch', function(){
	gulp.watch('dev/sass/*.sass', gulp.series('sass'));
});

gulp.task('server', function(){
	browserSync.init({server:'web'});
	browserSync.watch('web/**/*.{html,js,css}').on('change', browserSync.reload);
});

gulp.task('default', gulp.series('sass', gulp.parallel('watch', 'server')));