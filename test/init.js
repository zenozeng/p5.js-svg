// see also: https://github.com/kjbekkelund/karma-requirejs

require.config({
    baseUrl: '/base/', // for karma's base
    map: {
        '*': {
            'core': 'p5',
            'p5.svg': 'app'
        }
    },
    paths: {
        'app': 'src/app',
        'p5.SVGElement': 'src/objects/p5.SVGElement',
        'rendering.svg': 'src/rendering/svg',
        'svgcanvas': 'src/objects/svgcanvas',
        'testRender': 'test/test-render'
    }
});

var tests = Object.keys(window.__karma__.files).filter(function(test) {
    return test.indexOf('test/unit') > -1;
});

requirejs(tests, function() {
    window.__karma__.start();
});

