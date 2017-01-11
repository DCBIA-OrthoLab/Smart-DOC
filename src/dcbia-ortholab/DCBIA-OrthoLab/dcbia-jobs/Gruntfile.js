module.exports = function(grunt) {
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        ngtemplates: {
            'dcbia-jobs': {
                src: './src/**.html',
                dest: './dist/dcbia-jobs.templates.js'
            }
        },
        assets:{
            appJS: [
            './src/dcbia-jobs.module.js',
            './src/dcbia-jobs.directive.js',
            './dist/dcbia-jobs.templates.js'
            ]
        },
        concat: {
            prod: { //target
                files: {
                    './dist/dcbia-jobs.min.js' : '<%= assets.appJS %>'
                }
            },
            dev: {
                options: {
                    sourceMap: true
                },
                files: {
                    './dist/dcbia-jobs.min.js' : '<%= assets.appJS %>'
                }
            }
        },
        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            app: {
                files: {
                    './dist/dcbia-jobs.min.js': './dist/dcbia-jobs.min.js'
                }
            }
        },
        uglify: {
            prod: {
                files: {
                    './dist/dcbia-jobs.min.js': ['./dist/dcbia-jobs.min.js']
                }
            },
            dev: {
                options: {
                    mangle: false,
                    compress: false,
                    sourceMap: true,
                    sourceMapIncludeSources: true,
                    sourceMapIn: './dist/dcbia-jobs.min.js.map'
                },
                files: { //target
                    './dist/dcbia-jobs.min.js': ['./dist/dcbia-jobs.min.js']
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
                    'dist/dcbia-jobs.min.css': ['src/*.css']
                }
            }
        },
        clean: ['./dist/dcbia-jobs.templates.js'] 
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