/* Brocfile.js */

var JSHinter = require('broccoli-jshint'),
    compileSass = require('broccoli-sass'),
    concatenate = require('broccoli-concat'),
    mergeTrees  = require('broccoli-merge-trees'),
    uglifyJs    = require('broccoli-uglify-js'),
    filterTemplates = require('broccoli-template'),
    esTranspiler = require('broccoli-babel-transpiler'),
    broccoliHandlebars = require('broccoli-handlebars-precompiler'),
    app = 'app',
    appCss,
    templates,
    appHtml,
    appJs,
    mergedJs,
    compressedJs,
    nodeModules;

templates = broccoliHandlebars('app/templates', {
  srcDir: 'templates',
  namespace: 'STANDAPP.templates'
});

nodeModules = concatenate('node_modules', {
  headerFiles: ['handlebars/dist/handlebars.runtime.min.js'],
  outputFile : '/node_modules.js',
  sourceMapConfig: { enabled: false }
});
//
// templates = filterTemplates('app/templates', {
//   extensions: ['tl'],
//   compileFunction: 'Hanlebars.compile'
// });

//templates = esTranspiler(templates);

// headerFiles: ['config.js', 'images.js', 'styles.js', 'templates.js', 'appv2.js'],
appJs = concatenate(app, {
  headerFiles: ['config.js', 'appv2.js'],
  // inputFiles : ['**/*.js'],
  outputFile : '/standapp.js',
  sourceMapConfig: { enabled: false }
});

// appCss = compileSass(
//   ['app/styles'],
//   '/styles.scss',
//   'resources/app.css'
// );

// var node = new JSHinter(appJs);

// appJs = uglifyJs(appJs, {
//   compress: true,
//   mangle: true
// });

 var mergedJs = mergeTrees([nodeModules, appJs, templates]);
//
var compressedJs = concatenate(mergedJs, {
  //header: 'STANDAPP = { templates: [] };',
  outputFile: 'standapp.min.js',
  sourceMapConfig: { enabled: false }
});

// merge HTML, JavaScript and CSS trees into a single tree and export it
// module.exports = mergeTrees([compressedJs, appCss]);
// module.exports = mergeTrees([compressedJs, appCss]);
module.exports = compressedJs
