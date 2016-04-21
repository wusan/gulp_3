//深度压缩，需要gulp-imagemin 、imagemin-pngquant
//gulp-cache  只压缩已修改的图片。避免全部压缩
var gulp = require('gulp'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'); //确保本地已安装gulp-cache [cnpm install gulp-cache --save-dev]
    
gulp.task('testImagemin', function () {
    gulp.src('img/*.{png,jpg,gif,ico}')
        .pipe(cache(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('default',['testImagemin']); //定义默认任务


