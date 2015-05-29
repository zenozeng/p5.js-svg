// Karma configuration
// Generated on Mon May 25 2015 17:53:42 GMT+0800 (CST)

module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['mocha', 'requirejs'],
        files: [
            // note: lower index will override greater index config
            'node_modules/chai/chai.js',
            'test/bower_components/jquery/dist/jquery.js',
            'test/bower_components/p5.js/lib/p5.js',
            {pattern: 'test/unit/**/*.js', included: false},
            {pattern: 'src/**/*.js', included: false},
            {pattern: 'test/test-render.js', included: false},
            'test/init.js'
        ],
        preprocessors: {
            'src/**/*.js': ['coverage']
        },
        reporters: ['progress', 'coverage', 'mocha'],
        coverageReporter: {
            type : 'html',
            dir : 'test/report/coverage/',
            subdir: function(browser) {
                return browser.toLowerCase().split(/[ /-]/)[0];
            }
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        // logLevel: config.LOG_DEBUG,
        autoWatch: false,
        browsers: ['Chrome', 'Firefox'],
        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true // output all logs to stdout instead of click debug button
    });
};