module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            all: ['Gruntfile.js', 'src/**/*.js']
        },
        requirejs: {
            unmin: {
                options: {
                    baseUrl: '.',
                    findNestedDependencies: true,
                    include: ['src/app'],
                    optimize: 'none',
                    paths: {
                        'app': 'src/app',
                        'core': 'src/core/core',
                        'p5.SVGElement': 'src/objects/p5.SVGElement',
                        'rendering.svg': 'src/rendering/svg',
                        'svgcanvas': 'src/objects/svgcanvas'
                    },
                    useStrict: true,
                    out: 'dist/p5.svg.js',
                    onModuleBundleComplete: function (data) {
                        var fs = require('fs'),
                            amdclean = require('amdclean'),
                            outputFile = data.path;

                        fs.writeFileSync(outputFile, amdclean.clean({
                            filePath: outputFile,
                            globalObject: true,
                            transformAMDChecks: false,
                            escodegen: {
                                format: {
                                    indent: {
                                        style: '    '
                                    }
                                }
                            }
                        }));
                    },
                    wrap: {
                        start:
                        ['/*! p5.svg.js v<%= pkg.version %> <%= grunt.template.today("mmmm dd, yyyy") %> */',
                         '(function (root, factory) {',
                         '  if (typeof define === \'function\' && define.amd)',
                         '    define(\'p5.svg\', [\'p5\'], function (p5) {factory(p5);});',
                         '  else if (typeof exports === \'object\')',
                         '    module.exports = factory;',
                         '  else',
                         '    factory(root[\'p5\']);',
                         '}(this, function (p5) {\n'].join('\n'),
                        end: '\n}));'
                    }

                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('build', ['requirejs']);
    grunt.registerTask('default', ['requirejs', 'jshint']);

};
