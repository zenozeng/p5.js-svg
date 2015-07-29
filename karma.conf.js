// Karma configuration
// Generated on Mon May 25 2015 17:53:42 GMT+0800 (CST)

module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['mocha', 'requirejs'],
        // client: {
        //     // requireJsShowNoTimestampsError: false
        // },
        files: [
            // note: lower index will override greater index config
            'test/bower_components/p5.js/p5.js',
            'test/bower_components/jquery/dist/jquery.js',
            {pattern: 'test/bower_components/chai/*.js', included: false},
            {pattern: 'test/unit/**/*.js', included: false},
            {pattern: 'src/**/*.js', included: false},
            {pattern: 'test/test-render.js', included: false},
            'test/init.js'
        ],
        preprocessors: {
            'src/**/!(svgcanvas).js': ['coverage']
            // 'src/**/*.js': ['coverage']
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
        logLevel: config.LOG_DISABLE,
        // logLevel: config.LOG_DEBUG,
        autoWatch: false,
        browsers: ['Chrome', 'Firefox'],
        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true // output all logs to stdout instead of click debug button
    });
};
