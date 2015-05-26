var tests = [];
for (var file in window.__karma__.files) {
    if (window.__karma__.files.hasOwnProperty(file)) {
        if (/\.test\.js$/.test(file)) {
            tests.push(file);
        }
    }
}

requirejs.config({
    baseUrl: '/base',
    paths: {
        'jquery': 'test/bower_components/jquery/dist/jquery.js'
    },
    callback: window.__karma__.start
});

require(["jquery"], function($) {
    console.log($);
});
