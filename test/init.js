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
        'constants': 'src/constants',
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

console.log(tests);
console.log(requirejs);


for (var file in window.__karma__.files) {
    // Fix there is no timestamp issue
    // See also: https://github.com/karma-runner/karma-requirejs/issues/6
    window.__karma__.files[file + "?_=" + now] = window.__karma__.files[file];
}

var started = false;

var iter = function() {
    console.log('iter');
    if (!started) {
        setTimeout(iter, 20);
    }
};
iter();

requirejs(tests, function() {
    started = true;
    console.log('started');
    window.__karma__.start();
});

