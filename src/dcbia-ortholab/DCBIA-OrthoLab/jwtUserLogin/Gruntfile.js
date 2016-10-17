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
        ngAnnotate: {
		    options: {
		        singleQuotes: true
		    },
            app: {
                files: {
                    './src/jwtUserLogin.module.minified.js': ['./src/jwtUserLogin.module.js'],
                    './src/jwtUserLogin.service.minified.js': ['./src/jwtUserLogin.service.js'],
                    './src/jwtUserLogin.directive.minified.js': ['./src/jwtUserLogin.directive.js'],
                    './src/jwtUserLogin.templates.minified.js': ['./src/jwtUserLogin.templates.js']
                }
            }
		},
		concat: {
    		js: { //target
        		src: ['./src/jwtUserLogin.module.minified.js', './src/jwtUserLogin.service.minified.js', './src/jwtUserLogin.directive.minified.js', './src/jwtUserLogin.templates.minified.js'],
        		dest: './dist/' + name + '.min.js'
    		},
            dev: {
                src: ['./src/jwtUserLogin.module.js', './src/jwtUserLogin.service.js', './src/jwtUserLogin.directive.js', './src/jwtUserLogin.templates.js'],
                dest: './dist/' + name + '.js',
            }
		},
		uglify: {
    		js: { //target
        		src: ['./dist/' + name + '.min.js'],
        		dest: './dist/' + name + '.min.js'
    		}
		},
        clean: ['./src/*.minified.js', './src/jwtUserLogin.templates.js']   
    });

    //load grunt tasks
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-ng-annotate'); 
    grunt.loadNpmTasks('grunt-angular-templates');

    //register grunt default task
    grunt.registerTask('default', ['ngtemplates', 'ngAnnotate', 'concat', 'uglify','clean']);
}