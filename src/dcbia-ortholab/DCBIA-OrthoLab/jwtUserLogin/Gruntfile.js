module.exports = function(grunt) {
    var name = 'jwt-user-login';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        ngtemplates: {
            'jwt-user-login': {
                src: './src/**.html',
                dest: './src/jwtUserLogin.templates.js'
            }
        },
        assets:{
            appJS: ['./src/jwtUserLogin.module.js', 
            './src/jwtUserLogin.service.js', 
            './src/jwtUserLogin.directive.js',
            './src/usersManager.directive.js',
            './src/jwtUserLogin.templates.js']
        },
        concat: {
            js: { //target
                files: {
                    './dist/jwt-user-login.min.js' : '<%= assets.appJS %>'
                }
            },
            dev: {
                options: {
                    sourceMap: true
                },
                files: {
                    './dist/jwt-user-login.min.js' : '<%= assets.appJS %>'
                }
            }
        },
        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            app: {
                files: {
                    './dist/jwt-user-login.min.js': ['./dist/jwt-user-login.min.js']
                }
            }
        },
        uglify: {
            prod: {
                files: {
                    './dist/jwt-user-login.min.js': ['./dist/jwt-user-login.min.js']
                }
            },
            dev: {
                options: {
                    mangle: false,
                    compress: false,
                    sourceMap: true,
                    sourceMapIncludeSources: true,
                    sourceMapIn: './dist/jwt-user-login.min.js.map'
                },
                files: { //target
                    './dist/jwt-user-login.min.js': ['./dist/jwt-user-login.min.js']
                }
            }
        },
        clean: ['./src/jwtUserLogin.templates.js']
    });

    //load grunt tasks
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-ng-annotate'); 
    grunt.loadNpmTasks('grunt-angular-templates');

    //register grunt default task
    grunt.registerTask('default', ['ngtemplates', 'concat:js', 'ngAnnotate', 'uglify:prod', 'clean']);
    grunt.registerTask('dev', ['ngtemplates', 'concat:dev', 'ngAnnotate', 'uglify:dev', 'clean']);
}