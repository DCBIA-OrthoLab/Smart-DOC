module.exports = function(grunt) {
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        ngtemplates: {
            'dcbia-surveys': {
                src: './src/**.html',
                dest: './dist/dcbia-surveys.templates.js'
            }
        },
        assets:{
            appJS: [
            './src/dcbia-surveys.module.js',
            './src/TMJSurvey.directive.js',
            './dist/dcbia-surveys.templates.js',
            './dist/dcbia-surveys.templates.js'
            ]
        },
        concat: {
            prod: { //target
                files: {
                    './dist/dcbia-surveys.min.js' : '<%= assets.appJS %>'
                }
            },
            dev: {
                options: {
                    sourceMap: true
                },
                files: {
                    './dist/dcbia-surveys.min.js' : '<%= assets.appJS %>'
                }
            }
        },
        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            app: {
                files: {
                    './dist/dcbia-surveys.min.js': './dist/dcbia-surveys.min.js'
                }
            }
        },
        uglify: {
            prod: {
                options: {
                    compress: false
                },
                files: {
                    './dist/dcbia-surveys.min.js': ['./dist/dcbia-surveys.min.js']
                }
            },
            dev: {
                options: {
                    mangle: false,
                    compress: false,
                    sourceMap: true,
                    sourceMapIncludeSources: true,
                    sourceMapIn: './dist/dcbia-surveys.min.js.map'
                },
                files: { //target
                    './dist/dcbia-surveys.min.js': ['./dist/dcbia-surveys.min.js']
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
                    'dist/dcbia-surveys.min.css': ['src/*.css']
                }
            }
        },
        clean: ['./dist/dcbia-surveys.templates.js'] 
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