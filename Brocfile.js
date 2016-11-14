/* Brocfile.js */

var Funnel = require('broccoli-funnel'),
    concatenate = require('broccoli-concat'),
    uglifyJs    = require('broccoli-uglify-js'),
    mergeTrees  = require('broccoli-merge-trees'),
    app,
    scaffold;

app = new Funnel('./', {
  include: ['app/javascripts/**/*', 'tmp/templates.js', 'node_modules/handlebars/dist/handlebars.runtime.min.js'],
});

scaffold = new Funnel('app/scaffold', {
  include: ['*.js']
});

app = concatenate(app, {
  outputFile: 'standapp.min.js',
  sourceMapConfig: { enabled: false }
});

// app = uglifyJs(app, {
//   compress: false,
//   mangle: false
// });
//
scaffold = uglifyJs(scaffold, {
  compress: true,
  mangle: true
});

module.exports = mergeTrees([scaffold, app]);
