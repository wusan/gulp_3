/**
js合并
进入目录：
    node下：D:\gulp
    执行命令：gulp即可，不需要gulp gulpfile.js;
**/
var gulp = require('gulp'),
    concat = require('gulp-concat');
 
gulp.task('testConcat', function () {
    gulp.src('js/*.js')
        .pipe(concat('all.js'))//合并后的文件名
        .pipe(gulp.dest('dist/js'));
});

gulp.task('default',['testConcat']); //定义默认任务


