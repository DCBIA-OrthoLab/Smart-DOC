module.exports = function(grunt) {
    
    const webpackConfig = require('./webpack.config');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        ngtemplates: {
            'dcbia-vtk-module': {
                src: './src/**.html',
                dest: './dist/dcbia-vtk.templates.js'
            }
        },
        webpack: {
          options: {
            stats: !process.env.NODE_ENV || process.env.NODE_ENV === 'development',
            cache: true
          },
          prod: webpackConfig,
          dev: webpackConfig
        },
        assets:{
            appJS: [
            './src/dcbia-vtk.module.js',
            './src/dcbia-vtk.service.js',
            './dist/dcbia-vtk.directive.js',
            './dist/dcbia-vtk.templates.js'
            ]
        },
        concat: {
            prod: { //target
                files: {
                    './dist/dcbia-vtk.min.js' : '<%= assets.appJS %>'
                }
            },
            dev: {
                options: {
                    sourceMap: true
                },
                files: {
                    './dist/dcbia-vtk.min.js' : '<%= assets.appJS %>'
                }
            }
        },
        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            app: {
                files: {
                    './dist/dcbia-vtk.min.js': './dist/dcbia-vtk.min.js'
                }
            }
        },
        uglify: {
            prod: {
                files: {
                    './dist/dcbia-vtk.min.js': ['./dist/dcbia-vtk.min.js']
                }
            },
            dev: {
                options: {
                    mangle: false,
                    compress: false,
                    sourceMap: true,
                    sourceMapIncludeSources: true,
                    sourceMapIn: './dist/dcbia-vtk.min.js.map'
                },
                files: { //target
                    './dist/dcbia-vtk.min.js': ['./dist/dcbia-vtk.min.js']
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
                    'dist/dcbia-vtk.min.css': ['src/*.css']
                }
            }
        },
        clean: {
            dev: ['./dist/dcbia-vtk.templates.js'],
            prod: ['./dist/dcbia-vtk.templates.js', './dist/dcbia-vtk.directive.js', './dist/dcbia-vtk.min.js.map'],
        } 
    });

    //load grunt tasks
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-ng-annotate'); 
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-webpack');


    //register grunt default task
    grunt.registerTask('default', [ 'ngtemplates', 'webpack:prod', 'concat:prod', 'ngAnnotate', 'cssmin', 'clean:prod' ]);
    //register dev task
    grunt.registerTask('dev', [ 'ngtemplates', 'concat:dev', 'ngAnnotate', 'cssmin', 'clean:dev' ]);
    grunt.registerTask('build', [ 'webpack:dev' ]);
}
