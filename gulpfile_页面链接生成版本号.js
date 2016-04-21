/**
gulp-rev-append 插件将通过正则(?:href|src)=”(.*)[?]rev=(.*)[“]查找并给指定链接填加版本号
	（默认根据文件MD5生成，因此文件未发生改变，此版本号将不会变）
故需要在html页面中加入 eg：

<!doctype html>
<html>
  <head>
    <script src="../js/group.js?rev=@@hash"></script>
  </head>
  <body>
    <div>hello, world!</div>
    <img src="../img/ic3.jpg?rev=@@hash" alt="" />
  </body>
</html>

注意：文件夹中必须真有这些js、css、img 才可以。

**/
var gulp = require('gulp'),
    rev = require('gulp-rev-append');
    
gulp.task('testRev', function () {
    gulp.src('html/index.html')
        .pipe(rev())
        .pipe(gulp.dest('dist/html'));
});

gulp.task('default',['testRev']); //定义默认任务


