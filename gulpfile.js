const { src, dest, parallel, series, watch } = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const browsersync = require('browser-sync');

/**
 * Compile SCSS for development with source maps
 */
function scssDev() {
    return src('scss/styles.scss')
        .pipe(sourcemaps.init())
        .pipe(
            sass({ outputStyle: 'expanded' }).on('error', function (err) {
                console.log(err.message);
                this.emit('end');
            })
        )
        .pipe(autoprefixer({ cascade: false, grid: true }))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('dist'));
}

/**
 * Compile and minify SCSS for production
 */
function scssProd() {
    return src('scss/styles.scss')
        .pipe(
            sass({ outputStyle: 'compressed' }).on('error', function (err) {
                console.log(err.message);
                this.emit('end');
            })
        )
        .pipe(autoprefixer({ cascade: false, grid: true }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest('dist'));
}

/**
 * Combine JS into single file for development with source maps
 */
function jsDev() {
    return src([
        'js/**/*.js',
        'node_modules/bootstrap/dist/js/bootstrap.js'
        ])
        .pipe(sourcemaps.init())
        .pipe(
            babel({
                presets: ['@babel/env']
            })
        )
        .pipe(concat('scripts.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('dist'));
}

/**
 * Combine and minify JS for production
 */
function jsProd() {
    return src([
        'js/**/*.js',
        'node_modules/bootstrap/dist/js/bootstrap.js'
        ])
        .pipe(
            babel({
                presets: ['@babel/env']
            })
        )
        .pipe(concat('scripts.js'))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest('dist'));
}

/**
 * Browsersync task (auto reloading)
 */
function browserSync() {
    browsersync.init({
        server: true,
        open: false,
        files: [
            'dist/*.css',
            'dist/*.js',
            '*.html',
        ],
    });
    watch('scss/**/*.scss', scssDev);
    watch('js/**/*.js', jsDev);
    watch('*.html').on('change', browsersync.reload);
}


exports.start = series(parallel(scssDev, jsDev), browserSync);
exports.build = parallel(scssDev, scssProd, jsDev, jsProd);
