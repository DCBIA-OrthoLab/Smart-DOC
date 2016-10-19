module.exports = function(grunt) {
    var name = 'nav-bar';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        ngAnnotate: {
		    options: {
		        singleQuotes: true
		    },
            app: {
                files: [{
                    expand: true,
                    src: ['./src/*.js', './src/*.annotated.js'],
                    ext: '.annotated.js',
                    extDot: 'last'
                }]
            }
		},
		concat: {
    		js: { //target
        		src: ['./src/*.module.annotated.js', './src/*.annotated.js'],
        		dest: './src/' + name + '.min.js'
    		}
		},
		uglify: {
    		js: { //target
        		src: ['./src/' + name + '.min.js'],
        		dest: './src/' + name + '.min.js'
    		}
		},
        clean: ['./src/*.annotated.js']   
    });

    //load grunt tasks
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-ng-annotate'); 

    //register grunt default task
    grunt.registerTask('default', ['ngAnnotate', 'concat', 'uglify','clean']);
}

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        ngtemplates: {
            'nav-bar': {
                src: './src/**.html',
                dest: './dist/nav-bar.templates.js'
            }
        },
        assets:{
            appJS: [
            './src/nav-bar.module.js',
            './src/nav-bar.directive.js',
            './dist/nav-bar.templates.js'
            ]
        },
        concat: {
            prod: { //target
                files: {
                    './dist/nav-bar.min.js' : '<%= assets.appJS %>'
                }
            },
            dev: {
                options: {
                    sourceMap: true
                },
                files: {
                    './dist/nav-bar.min.js' : '<%= assets.appJS %>'
                }
            }
        },
        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            app: {
                files: {
                    './dist/nav-bar.min.js': './dist/nav-bar.min.js'
                }
            }
        },
        uglify: {
            prod: {
                files: {
                    './dist/nav-bar.min.js': ['./dist/nav-bar.min.js']
                }
            },
            dev: {
                options: {
                    mangle: false,
                    compress: false,
                    sourceMap: true,
                    sourceMapIncludeSources: true,
                    sourceMapIn: './dist/nav-bar.min.js.map'
                },
                files: { //target
                    './dist/nav-bar.min.js': ['./dist/nav-bar.min.js']
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
                    'dist/nav-bar.min.css': ['src/*.css']
                }
            }
        },
        clean: ['./dist/nav-bar.templates.js']   
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