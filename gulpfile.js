var gulp = require('gulp'),
    path = require('path'),
    Builder = require('systemjs-builder'),
    ts = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    embedTemplates = require('gulp-angular-embed-templates');

var tsProject = ts.createProject('tsconfig.json');

// build and bundle client side ts and html
var appDev = '';
var appProd = 'dist';

gulp.task('ts-client', () => {
    return gulp.src(appDev + '/**/*.ts')
        .pipe(embedTemplates({ sourceType: 'ts' }))
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(tsProject())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(appProd));
});

gulp.task('bundle-client', function () {
    var builder = new Builder('', 'systemjs.config.js');
    return builder
        .buildStatic(appProd + '/main.js', appProd + '/bundle.js', {
            minify: false, sourceMaps: true, encodeNames: false
        })
        .then(function () {
            console.log('Build complete');
        })
        .catch(function (err) {
            console.log('Build error');
            console.log(err);
        });
});

gulp.task('build', gulp.series(['ts-client', 'bundle-client']));