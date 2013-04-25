/**
 * Jake build script
 */
var jake = require('jake'),
    browserify = require('browserify'),
    path = require('path');

require('jake-utils');

// constants
var VIS = './vis.js';
var VIS_MIN = './vis.min.js';

/**
 * default task
 */
desc('Execute all tasks: build all libraries');
task('default', ['build', 'minify'], function () {
    console.log('done');
});

/**
 * build the visualization library vis.js
 */
desc('Build the visualization library vis.js');
task('build', {async: true}, function () {
    // concatenate and stringify css files
    var result = concat({
        src: [
            './src/component/css/panel.css',
            './src/component/css/item.css',
            './src/component/css/timeaxis.css'
        ],
        header: '/* vis.js stylesheet */',
        separator: '\n'
    });
    var cssText = JSON.stringify(result.code);

    // bundle the script files
    // TODO: do not package moment.js with vis.js.
    var b = browserify();
    b.add('./src/vis.js');
    b.bundle({
        standalone: 'vis'
    }, function (err, code) {
        // add header and footer
        var lib =
            read('./src/header.js') +
            code +
            read('./src/module.js') +
            '\nloadCss(' + cssText + ');\n';  // inline css

        // write bundled file
        write(VIS, lib);
        console.log('created ' + VIS);

        // update version number and stuff in the javascript files
        replacePlaceholders(VIS);

        complete();
    });
});

/**
 * minify the visualization library vis.js
 */
desc('Minify the visualization library vis.js');
task('minify', function () {
    // minify javascript
    minify({
        src: VIS,
        dest: VIS_MIN,
        header: read('./src/header.js')
    });

    // update version number and stuff in the javascript files
    replacePlaceholders(VIS_MIN);

    console.log('created ' + VIS_MIN);
});

/**
 * replace version, date, and name placeholders in the provided file
 * @param {String} filename
 */
var replacePlaceholders = function (filename) {
    replace({
        replacements: [
            {pattern: '@@name',    replacement: 'vis.js'},
            {pattern: '@@date',    replacement: today()},
            {pattern: '@@version', replacement: version()}
        ],
        src: filename
    });
};
