var gulp = require('gulp'),
    server = require('gulp-server-livereload'),
    wiredep = require('wiredep').stream,
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    imagemin = require('gulp-imagemin'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    cleanCSS = require('gulp-clean-css'),
    useref = require('gulp-useref'),
    rimraf = require('rimraf');

var path = {
    
    src: {
        html:'app/*.html',
        sass: 'app/sass/**/*.scss',
        img: 'app/img/**/*',
        font: 'app/font/*'
    },
    
    build: {
        img: 'build/img',
        font: 'build/font',
        all: 'build'
    }
};

gulp.task('server', function() {
    gulp.src('app')
    .pipe(server({
        livereload: true,
        defaultFile: 'index.html',
        open: true
    }));
});

gulp.task('bower', function() {
    gulp.src(path.src.html)
    .pipe(wiredep({
        directory: 'app/bower_components'
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('style', function() {
    return gulp.src(path.src.sass)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: ['last 15 versions'],
        cascade: false
    }))
    .pipe(gulp.dest('app/css'));
});

gulp.task('watch',function() {
    gulp.watch(path.src.sass, ['style']);
    gulp.watch('bower.json', ['bower']);
});
    
gulp.task('default',['server','watch']);

//build
gulp.task('images', function() {
    return gulp.src(path.src.img)
    .pipe(imagemin({
        progressive: true,
        optimizationLevel: 7
    }))
    .pipe(gulp.dest(path.build.img));
});

gulp.task('fonts', function() {
    gulp.src(path.src.font)
    .pipe(gulp.dest(path.build.font));
});

gulp.task('build', ['images','fonts'], function() {
    return gulp.src(path.src.html)
    .pipe(useref())
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.css', cleanCSS()))
    .pipe(gulp.dest(path.build.all))
});

gulp.task('clean', function(cb) {
    rimraf(path.build.all, cb);
});