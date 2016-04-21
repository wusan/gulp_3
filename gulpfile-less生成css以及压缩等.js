
//调用多模块（编译less后压缩css）:require('gulp-minify-css')
//监听事件（自动编译less）: gulp.watch('src/**/*.less', ['testLess']); //当所有less文件发生改变时，调用testLess任务

// 当发生异常时提示错误 确保本地安装gulp-notify和gulp-plumber
// notify = require('gulp-notify'),
//plumber = require('gulp-plumber');


var gulp = require('gulp'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),//当发生异常时提示错误 确保本地安装gulp-notify和gulp-plumber
    less = require('gulp-less'),
	cssmin=require('gulp-minify-css');//引入 css压缩模块

gulp.task('testLess', function () {
    //编译src目录下的所有less文件
    //除了basic.less
	gulp.src(['src/*.less','!src/basic.less']) 
		.pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
		//当编译less时出现语法错误或者其他异常，会终止watch事件，通常需要查看命令提示符窗口才能知道，这并不是我们所希望的，
		//所以我们需要处理出现异常并不终止watch事件（gulp-plumber），并提示我们出现了错误（gulp-notify）
		
		
        .pipe(less()) //该任务调用的模块
		.pipe(cssmin()) //压缩css
        .pipe(gulp.dest('src/css'));
});
 
gulp.task('testWatch',function(){  //testWatch测试失败
	gulp.watch('src/*.less',['testLess']);//当所有less文件发生改变时，调用testLess任务
})
gulp.task('default',['testLess', 'elseTask']); //定义默认任务


