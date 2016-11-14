var fs = require('fs'),
    config = require('config'),
    Handlebars = global.Handlebars = require('handlebars'),
    hbsPrecompiler = require('handlebars-precompiler'),
    precompiledFilePath = 'tmp/precompiled-templates.js',
    compiledFilePath = 'tmp/templates.js',
    precompiled;


precompiled = hbsPrecompiler.do({
  templates: ['app/templates/'],
  output: precompiledFilePath,
  min: false
});

fs.readFile(precompiledFilePath, 'utf8', function (err, data) {
  if (err) { return console.log(err); }

  console.log('Precompiled Handlebars templates.');
  var wrappedFileContents = [
                              config.get('globalAppObjectName'),
                              '.templates = function() {',
                              data,
                              ' return Handlebars.templates;}'
                            ].join('');

  fs.writeFile(compiledFilePath, wrappedFileContents, function(err) {
    if (err) { return console.log(err); }
    console.log("Wrapped and saved precompiled Handlebars templates.");
  });

});
