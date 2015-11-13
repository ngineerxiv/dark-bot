require('coffee-script/register')
var gulp = require('gulp');
var exec = require('gulp-exec');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');

gulp.task('test', function(){
    gulp.src(['test/*.coffee'], {read: false})
                     .pipe(mocha({reporter: 'list'}))
                     .on('error', gutil.log)
});

gulp.task('watch', function(){
    gulp.watch('./**/*.coffee', ['test']);
});
