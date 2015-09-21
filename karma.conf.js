// Karma configuration
// Generated on Mon May 25 2015 17:53:42 GMT+0800 (CST)

module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['browserify', 'mocha'],
        files: [
            // note: lower index will override greater index config
            'test/bower_components/p5.js/p5.js',
            'test/bower_components/jquery/dist/jquery.js',
            'build/entry.js',
            {pattern: 'src/**/*.js', included: false},
            {pattern: 'test/unit/**/*.svg', included: false},
            {pattern: 'test/unit/**/*.jpg', included: false},
            'test/unit/bundle.js'
        ],
        preprocessors: {
            'build/entry.js': ['browserify']
        },
        "browserify": {
            "debug": true,
            "transform": ["browserify-istanbul"]
        },
        reporters: ['progress', 'coverage', 'mocha'],
        coverageReporter: {
            type: 'lcovonly',
            dir : 'test/coverage/',
            subdir: '.',
            file: 'lcov.info'
        },
        port: 9876,
        colors: true,
        // logLevel: config.LOG_DISABLE,
        // logLevel: config.LOG_DEBUG,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ['Chrome', 'Firefox'],
        // browsers: ['Chrome'],
        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true // output all logs to stdout instead of click debug button
    });
};
