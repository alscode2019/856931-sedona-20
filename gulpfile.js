const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const less = require("gulp-less");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const csso = require("gulp-csso"); // Минификация CSS
const rename = require("gulp-rename"); // Переименование файла
const imagemin = require("gulp-imagemin"); // Оптимизация изображений
const webp = require("gulp-webp"); // Создаём WebP
const svgstore = require("gulp-svgstore"); // SVG спрайт
const del = require("del"); // Удаление
const uglify = require("gulp-uglify"); // Минификация JS
const posthtml = require("gulp-posthtml"); // Проверка HTML
const htmlmin = require('gulp-htmlmin'); // Минификация  HTML
const include = require("posthtml-include");

// CSS

const styles = () => {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("source/css"))
    .pipe(sync.stream());
};

exports.styles = styles;



// BuildStyle

const css = () => {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
};

exports.css = css;


// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};

exports.server = server;

 //Watcher

 const watcher = () => {
  gulp.watch("source/less/**/*.less", gulp.series("css"));
  gulp.watch("source/*.html").on("change", sync.reload);
};

exports.default = gulp.series(
  css, server, watcher
);


// Images

const images = () => {
  return gulp.src("source/img/**/*.{jpg,png,svg}")
    .pipe(imagemin([
imagemin.optipng({ optimizationLevel: 3 }),
imagemin.mozjpeg({ quality: 75, progressive: true }),
imagemin.svgo()
]))
.pipe(gulp.dest("build/img"));
};

exports.images = images;


// WebP

const createWebp = () => {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({
      quality: 80
    }))
    .pipe(gulp.dest("build/img/webp"));
};
exports.webp = createWebp;


// SVG-sprite

const sprite = () => {
  return gulp.src("source/img/**/icon-*.svg")
    .pipe(svgstore())
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
};
exports.sprite = sprite;

// Jsmin

const jsmin = () => {
  return gulp.src("source/js/*.js")
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/js"));
};
exports.jsmin = jsmin;


// HTML

const html = () => {
  return gulp
    .src("source/*.html")
    .pipe(posthtml([include()]))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"));
};
exports.html = html;

// Сlean

const clean = () => {
  return del("build");
};
exports.clean = clean;


// Copy

const copy = () => {
  return gulp.src([
"source/fonts/**/*.{woff,woff2}",
"source/js/**",
"source/*.ico"

], {
      base: "source"
    })
    .pipe(gulp.dest("build"));
};
exports.copy = copy;


/*gulp.task(
  "build",
  gulp.series("clean")
);

gulp.task("start", gulp.series("build", "server"));*/


// Build

const { series } = gulp;

exports.build = series(
  clean,
  copy,
  jsmin,
  css,
  images,
  createWebp,
  sprite,
  html
);

exports.start = series(
  clean,
  copy,
  jsmin,
  css,
  images,
  createWebp,
  sprite,
  html,
  server,
  watcher
);
