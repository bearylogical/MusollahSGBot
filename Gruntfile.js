module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            files: ['Gruntfile.js', '*.js'],
            options: {
                ignores: ['test*']
            }
        },
        jscs: {
            src: '*.js',
            options: {
                config: '.jscsrc',
                excludeFiles: ['test*']
            }
        },
        jsbeautifier: {
            files: ['*.js'],
            options: {}
        },
        nodemon: {
            dev: {
                script: 'index.js',
                options: {
                    nodeArgs: ['--inspect']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jscs'); // js code style
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-nodemon');

    grunt.registerTask('default', ['jsbeautifier', 'jshint', 'nodemon']);
    grunt.registerTask('style', ['jscs']);
    grunt.registerTask('start', ['nodemon']);
};
