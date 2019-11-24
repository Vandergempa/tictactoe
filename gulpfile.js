const { src, dest, watch, series, parallel } = require('gulp');

// Importing all the Gulp-related packages we want to use
const browsersync = require("browser-sync").create();
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const terser = require('gulp-terser')
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const webpack = require('webpack-stream')

// For serving up a static directory
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "./dist/"
    },
    port: 8888
  });
  done();
}

// Function to reload browserSync
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// File paths
const files = {
  htmlPath: 'src/**/*.html',
  scssPath: 'src/styles/**/*.scss',
  jsPath: 'src/js/**/*.js'
}

// Html task
function htmlTask() {
  return src(files.htmlPath) // loading the source directory first
    .pipe(dest('dist') // put final HTML in dist folder
    )
}

// Sass task: compiles the style.scss file into style.css
function scssTask() {
  return src(files.scssPath) // loading the source directory first
    .pipe(sourcemaps.init()) // initialize sourcemaps first
    .pipe(sass()) // compile SCSS to CSS
    .pipe(postcss([autoprefixer(), cssnano()])) // PostCSS plugins: adding vendor prefixes + minifying
    .pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
    .pipe(dest('dist/styles') // put final CSS in dist folder
    )
}

// JS task: concatenates and uglifies JS files to script.js
function jsTask() {
  return src('src/js/script.js')
    .pipe(webpack({
      output: {
        filename: 'script.js',
      },
    }))
    // .pipe(concat('script.js'))
    .pipe(terser())
    .pipe(dest('dist/js')
    );
}

// This task watches the files in those folders and if any changes are made,
// runs them simultaneously.
function watchTask() {
  watch(
    [files.htmlPath, files.scssPath, files.jsPath],
    parallel(htmlTask, scssTask, jsTask, browserSyncReload)
  )
}

// The main gulp task that gets run by typing gulp in the cl.
exports.default = series(
  parallel(htmlTask, scssTask, jsTask),
  parallel(watchTask, browserSync))