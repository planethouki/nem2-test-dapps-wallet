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
const script = (filename) => () => {
    return browserify(`app/script/${filename}`)
        .transform("babelify", {presets: ["@babel/preset-env"]})
        .bundle()
        .pipe(source(filename))
        .pipe(dest('dist/'));
}
const scriptTasks = [
    'background.js',
    'contentscript.js',
    'inpage.js'
].map((filename) => script(filename));


exports.build = series(clean, parallel(copyHtml, copyManifest, copyImages, ...scriptTasks));