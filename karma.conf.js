// Karma configuration
// Generated on Mon May 25 2015 17:53:42 GMT+0800 (CST)

process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['mocha'],
        files: [
            // note: lower index will override greater index config
            {pattern: 'dist/*.js.map', included: false},
            {pattern: 'src/**/*.js', included: false},
            {pattern: 'test/unit/**/*', included: false},
            'https://unpkg.com/p5@1.4.0/lib/p5.min.js',
            'https://unpkg.com/jquery@3.6.0/dist/jquery.js',
            'dist/p5.svg.js',
            'dist/test.js'
        ],
        preprocessors: {
            '**/*.js': ['sourcemap']
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
        browsers: ['ChromeHeadless', 'Firefox'],
        // browsers: ['Chrome'],
        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true // output all logs to stdout instead of click debug button
    });
};
