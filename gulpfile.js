const gulp = require('gulp');

const htmlclean = require('gulp-htmlclean');
const htmlmin = require('gulp-htmlmin');

const cssclean = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');

// js
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const gulpif = require('gulp-if'); //条件判断
const removeUseStrict = require('gulp-remove-use-strict');

// img
const imagemin = require('gulp-imagemin');
const svgmin = require('gulp-svgmin');

const browserSync = require('browser-sync');
const sequence = require('gulp-sequence');
const cache = require('gulp-cache');

// 忽略已经压缩的文件
var condition = function (f) {
    if (f.path.endsWith('.min.js')) {
        console.log(f.path);
        return false;
    }
    return true;
};

// 压缩html
gulp.task('html', function () {
    return gulp
        .src(['./**/*.{html, htm}', '!./node_modules/**', '!./dist/**', '!./1.html', '!./icon/**'])
        .pipe(htmlclean())
        .pipe(
            htmlmin({
                //压缩空白部分
                collapseWhitespace: true,
                //压缩页面中通过style设置的css
                minifyCSS: true,
                //压缩页面中通过script设置的js
                minifyJS: true,
            })
        )
        .pipe(gulp.dest('./dist'))
        .pipe(browserSync.reload({ stream: true }));
});

// css
gulp.task('css', function () {
    return gulp
        .src(['./**/*.css', '!./node_modules/**', '!./dist/**'])
        .pipe(
            autoprefixer({
                browsers: ['last 2 versions', 'Android >= 4.0'],
                cascade: true, //是否美化属性值 默认：true 像这样：
                //-webkit-transform: rotate(45deg);
                //        transform: rotate(45deg);
                remove: true, //是否去掉不必要的前缀 默认：true
            })
        )
        .pipe(
            cssclean({
                keepSpecialComments: '*', //保留所有特殊前缀
            })
        )
        .pipe(gulp.dest('./dist'))
        .pipe(browserSync.reload({ stream: true }));
});

// js
gulp.task('uglify', function () {
    return gulp
        .src(['./**/*.js', '!./node_modules/**', '!./dist/**', '!gulpfile.js'])
        .pipe(gulpif(condition, babel()))
        .pipe(
            gulpif(
                condition,
                uglify({
                    mangle: false,
                })
            )
        )
        .pipe(gulp.dest('./dist'))
        .pipe(browserSync.reload({ stream: true }));
});

//图片处理
gulp.task('image', function () {
    return gulp
        .src(['./**/*.{png,jpg,jpeg,gif,ico,JPG,gif}', '!./dist/**', '!./node_modules/**'])
        .pipe(
            cache(
                imagemin({
                    optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
                    progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
                    interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
                    multipass: false, //类型：Boolean 默认：false 多次优化svg直到完全优化
                    svgoPlugins: [{ cleanupIDs: false }],
                })
            )
        )
        .pipe(gulp.dest('./dist'))
        .pipe(browserSync.reload({ stream: true }));
});

// svg文件处理
gulp.task('svgmin', function () {
    return gulp
        .src(['./**/*.svg', '!./dist/**', '!./node_modules/**'])
        .pipe(
            svgmin({
                plugins: [
                    {
                        removeDoctype: false,
                    },
                    {
                        removeComments: false,
                    },
                    {
                        cleanupNumericValues: {
                            floatPrecision: 2,
                        },
                    },
                    {
                        convertColors: {
                            names2hex: false,
                            rgb2hex: false,
                        },
                    },
                ],
            })
        )
        .pipe(gulp.dest('./dist'));
});

// 配置静态服务器
gulp.task('server', function () {
    //初始化
    browserSync.init({
        server: {
            //指定根目录，将来根目录中的内容发生变化以后我们会执行当前任务
            baseDir: './dist',
        },
    });
});

// gulp.task('copy1', function () {
//     return gulp
//         .src(['./download/**/*'])
//         .pipe(gulp.dest('dist/download/'))
//         .pipe(browserSync.reload({ stream: true }));
// });
//json文件复制
gulp.task('copy', function () {
    return gulp
        .src(['./json/**/*'])
        .pipe(gulp.dest('dist/josn/'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('copy2', function () {
    return gulp
        .src(['./video/**/*'])
        .pipe(gulp.dest('dist/video/'))
        .pipe(browserSync.reload({ stream: true }));
});

// 热更新
gulp.task('watch', ['server'], function () {
    //监视到 ./test/index.html文件，变化后执行html任务
    gulp.watch('./*.html', ['html']);
    gulp.watch('./css/*.css', ['css']);
});

// 启动
gulp.task('default', sequence('svgmin', 'image', 'css', 'copy', 'copy2', 'html', 'uglify', ['server', 'watch']));
