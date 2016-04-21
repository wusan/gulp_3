var gulp = require('gulp'),
    imagemin = require('gulp-imagemin');//img
 
gulp.task('testImagemin', function () {
    gulp.src('img/*.{png,jpg,gif,ico}')
        .pipe(imagemin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        .pipe(gulp.dest('dist/img'));//若无此目录，则会自动建立此目录
});

gulp.task('default',['testImagemin']); //定义默认任务


