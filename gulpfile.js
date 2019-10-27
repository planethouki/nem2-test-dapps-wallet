const { src, dest, parallel, series } = require('gulp');
const rimraf = require('rimraf');
const source = require('vinyl-source-stream');
const browserify = require('browserify');

function clean(cb) {
    rimraf('dist/', cb);
}
function copyHtml() {
    return src('app/*.html')
        .pipe(dest('dist/'));
}
function copyManifest() {
    return src('app/manifest.json')
        .pipe(dest('dist/'));
}
function copyImages() {
    return src('app/images/*')
        .pipe(dest('dist/'));
}
function copyLib() {
    return src('app/lib/*')
        .pipe(dest('dist/'));
}
const script1 = (filename) => () => {
    return browserify(`app/script/${filename}`)
        .transform("babelify", {presets: ["@babel/preset-env"]})
        .bundle()
        .pipe(source(filename))
        .pipe(dest('dist/'));
}
const scriptTasks1 = [
    'background.js',
    'contentscript.js',
    'inpage.js',
    'notification.js'
].map((filename) => script1(filename));


const script2 = (filename) => () => {
    return browserify(`app/script/${filename}`)
        .transform("babelify", {presets: ["@babel/preset-env", "@babel/preset-react"]})
        .bundle()
        .pipe(source(filename))
        .pipe(dest('dist/'));
}
const scriptTasks2 = [
    'popup.js',
].map((filename) => script2(filename));


exports.build = series(clean, parallel(copyHtml, copyManifest, copyImages, copyLib, ...scriptTasks1, ...scriptTasks2));