// Karma configuration
// Generated on Mon May 25 2015 17:53:42 GMT+0800 (CST)

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'requirejs'],

        // list of files / patterns to load in the browser
        files: [
            {pattern: 'src/**/*.js', include: false},
            {pattern: 'test/**/*.js', include: false},
            {pattern: 'test/init.js', include: true}
        ],

        preprocessors: {
            'src/**/*.js': ['coverage']
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'coverage'],

        coverageReporter: {
            type : 'html',
            dir : 'test/coverage/',
            subdir: function(browser) {
                return browser.toLowerCase().split(/[ /-]/)[0];
            }
        },

        // web server port
        port: 9876,
        colors: true,
        logLevel: config.LOG_DEBUG,
        autoWatch: false,
        browsers: ['Chrome'], // ['Chrome', 'Firefox'],
        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true
    });
};
