var gulp = require('gulp'),
    less = require('gulp-less'),
	htmlmin = require('gulp-htmlmin'),//html页面压缩，内部包含css js html
	cssmin=require('gulp-minify-css');//引入 css压缩模块

gulp.task('testHtmlmin', function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src('html/*.html')
        .pipe(htmlmin(options))
        .pipe(gulp.dest('dist/html'));
});

gulp.task('default',['testHtmlmin']); //定义默认任务


