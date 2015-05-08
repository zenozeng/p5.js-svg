module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        requirejs: {
            unmin: {
                options: {
                    baseUrl: '.',
                    out: 'dist/p5.svg.js',
                    findNestedDependencies: true,
                    include: ['src/app'],
                    optimize: 'none',
                    paths: {
                        'app': 'src/app',
                        'core': 'src/core/core',
                        'p5.SVGElement': 'src/objects/p5.SVGElement',
                        'rendering.svg': 'src/rendering/svg'
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-requirejs');

    grunt.registerTask('build', ['requirejs']);

};
