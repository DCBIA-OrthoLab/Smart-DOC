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