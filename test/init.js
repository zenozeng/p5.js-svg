// see also: https://github.com/kjbekkelund/karma-requirejs

var now = Date.now();
require.config({
    baseUrl: '/base/', // for karma's base
    map: {
        '*': {
            'core': 'p5',
            'p5.svg': 'app'
        }
    },
    urlArgs: "_=" + now,
    paths: {
        'app': 'src/app',
        'input': 'src/io/input',
        'output': 'src/io/output',
        'p5.SVGElement': 'src/objects/p5.SVGElement',
        'rendering.svg': 'src/rendering/svg',
        'svgcanvas': 'src/objects/svgcanvas',
        'chai': "test/bower_components/chai/chai",
        'testRender': 'test/test-render'
    }
});

var tests = Object.keys(window.__karma__.files).filter(function(test) {
    return test.indexOf('test/unit') > -1;
});

for (var file in window.__karma__.files) {
    // Fix there is no timestamp issue
    // See also: https://github.com/karma-runner/karma-requirejs/issues/6
    window.__karma__.files[file + "?_=" + now] = window.__karma__.files[file];
}

requirejs(tests, function() {
    window.__karma__.start();
});

