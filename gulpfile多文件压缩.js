var gulp = require('gulp'),
    less = require('gulp-less');
 
//定义一个testLess任务（自定义任务名称）
gulp.task('testLess', function () {
    //编译src目录下的所有less文件
    //除了basic.less
	gulp.src(['src/*.less','!src/basic.less']) //多个less文件
        .pipe(less()) //该任务调用的模块
        .pipe(gulp.dest('src/css')); //将会在src/css下生成index.css
});
 
gulp.task('default',['testLess', 'elseTask']); //定义默认任务



//匹配符“!”，“*”，“**”，“{}”
	//编译src目录下的所有less文件
    //除了reset.less和test.less（**匹配src/less的0个或多个子文件夹）
   // gulp.src(["src/less/*.less", "!src/less/**/{reset,test}.less"]) 

