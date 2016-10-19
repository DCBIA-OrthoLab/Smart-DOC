module.exports = function(grunt) {
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        ngtemplates: {
            'data-collections': {
                src: './src/**.html',
                dest: './dist/data-collections.templates.js'
            }
        },
        assets:{
            appJS: [
            './src/data-collection.module.js',
            './src/dcbia.service.js',
            './src/clinicalData.controller.js',
            './src/morphologicalData.controller.js',
            './dist/data-collections.templates.js'
            ]
        },
        concat: {
            prod: { //target
                files: {
                    './dist/data-collections.min.js' : '<%= assets.appJS %>'
                }
            },
            dev: {
                options: {
                    sourceMap: true
                },
                files: {
                    './dist/data-collections.min.js' : '<%= assets.appJS %>'
                }
            }
        },
        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            app: {
                files: {
                    './dist/data-collections.min.js': './dist/data-collections.min.js'
                }
            }
        },
        uglify: {
            prod: {
                files: {
                    './dist/data-collections.min.js': ['./dist/data-collections.min.js']
                }
            },
            dev: {
                options: {
                    mangle: false,
                    compress: false,
                    sourceMap: true,
                    sourceMapIncludeSources: true,
                    sourceMapIn: './dist/data-collections.min.js.map'
                },
                files: { //target
                    './dist/data-collections.min.js': ['./dist/data-collections.min.js']
                }
            }
        },
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'dist/data-collections.min.css': ['src/*.css']
                }
            }
        },
        clean: ['./dist/data-collections.templates.js'] 
    });

    //load grunt tasks
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-ng-annotate'); 
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-contrib-cssmin');


    //register grunt default task
    grunt.registerTask('default', [ 'ngtemplates', 'concat:prod', 'ngAnnotate', 'uglify:prod', 'cssmin', 'clean']);
    //register dev task
    grunt.registerTask('dev', [ 'ngtemplates', 'concat:dev', 'ngAnnotate', 'uglify:dev', 'cssmin', 'clean']);
}