/* Brocfile.js */

var JSHinter = require('broccoli-jshint'),
    compileSass = require('broccoli-sass'),
    concatenate = require('broccoli-concat'),
    mergeTrees  = require('broccoli-merge-trees'),
    uglifyJs    = require('broccoli-uglify-js'),
    app = 'app',
    appCss,
    appHtml,
    appJs;

/**
* concatenate and compress all of our JavaScript files in
* the project /app folder into a single app.js file in
* the build production folder
*/
appJs = concatenate(app, {
  headerFiles: ['config.js', 'styles.js', 'templates.js'],
  inputFiles : ['**/*.js'],
  outputFile : '/app.js',
});

// var node = new JSHinter(appJs);

appJs = uglifyJs(appJs, {
  compress: true,
  mangle: true
});

/**
* compile all of the SASS in the project /resources folder into
* a single app.css file in the build production/resources folder
*/
appCss = compileSass(
  ['app/styles'],
  '/styles.scss',
  'resources/app.css'
);

// merge HTML, JavaScript and CSS trees into a single tree and export it
module.exports = mergeTrees([appJs, appCss]);
