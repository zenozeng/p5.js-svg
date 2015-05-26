// Karma configuration
// Generated on Mon May 25 2015 17:53:42 GMT+0800 (CST)

module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['mocha'],
        files: [
            // 'bower_components/p5.js/lib/p5.js',
            // 'coverage/instrument/dist/p5.svg.js',
            // 'bower_components/jquery/dist/jquery.js',
            // 'bower_components/mocha/mocha.js',
            // 'unit/**/*.js',
            // 'test.js'
            // 'test/index.html'
            'node_modules/chai/chai.js',
            'test/main.js'
        ],
        preprocessors: {
            // 'test/*.html': ['html2js'],
            // 'dist/**/*.js': ['coverage']
        },
        // reporters: ['progress', 'coverage'],
        coverageReporter: {
            type : 'html',
            dir : 'test/coverage/',
            subdir: function(browser) {
                return browser.toLowerCase().split(/[ /-]/)[0];
            }
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ['Chrome'], // ['Chrome', 'Firefox'],
        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true
    });
};
