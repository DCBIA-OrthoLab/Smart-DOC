module.exports = function(grunt) {
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        ngtemplates: {
            'dcbia-plots': {
                src: './src/**.html',
                dest: './dist/dcbia-plots.templates.js'
            }
        },
        assets:{
            appJS: [
            'node_modules/d3/build/d3.min.js',
            './src/dcbia-plots.module.js',
            './src/boxPlot.directive.js',
            './src/circlePlot.directive.js',
            './src/d3Plots.directive.js',
            './src/dcbia-plots.module.js'
            ]
        },
        concat: {
            prod: { //target
                files: {
                    './dist/dcbia-plots.min.js' : '<%= assets.appJS %>'
                }
            },
            dev: {
                options: {
                    sourceMap: true
                },
                files: {
                    './dist/dcbia-plots.min.js' : '<%= assets.appJS %>'
                }
            }
        },
        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            app: {
                files: {
                    './dist/dcbia-plots.min.js': './dist/dcbia-plots.min.js'
                }
            }
        },
        uglify: {
            prod: {
                files: {
                    './dist/dcbia-plots.min.js': ['./dist/dcbia-plots.min.js']
                }
            },
            dev: {
                options: {
                    mangle: false,
                    compress: false,
                    sourceMap: true,
                    sourceMapIncludeSources: true,
                    sourceMapIn: './dist/dcbia-plots.min.js.map'
                },
                files: { //target
                    './dist/dcbia-plots.min.js': ['./dist/dcbia-plots.min.js']
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
                    'dist/dcbia-plots.min.css': ['src/*.css']
                }
            }
        },
        clean: ['./dist/dcbia-plots.templates.js'] 
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