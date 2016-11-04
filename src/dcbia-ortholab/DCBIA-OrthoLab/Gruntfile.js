module.exports = function(grunt) {
    var name = 'clusterpost-list';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        run_grunt: {
            prod: {
                options: {
                    log: false,
                    process: function(res){
                        if (res.fail){
                            console.error(res);
                        }
                    }
                },
                src: ['./data-collections/Gruntfile.js',
                './dcbia-plots/Gruntfile.js',
                './dcbia-surveys/Gruntfile.js',
                './jwtUserLogin/Gruntfile.js',
                './nav-bar/Gruntfile.js']
            },
            dev: {
                options: {
                    log: true,
                    process: function(res){
                        if (res.fail){
                            console.error(res);
                        }
                    },
                    debugCli: true,
                    task: ['dev']
                },
                src: ['./data-collections/Gruntfile.js',
                './dcbia-plots/Gruntfile.js',
                './dcbia-surveys/Gruntfile.js',
                './jwtUserLogin/Gruntfile.js',
                './nav-bar/Gruntfile.js']
            },
        },
        watch: {
            options: {
                livereload: {
                  port: 9000
                }
            },
            html: {
                files: ['./data-collections/src/*.html',
                './dcbia-plots/src/*.html',
                './dcbia-surveys/src/*.html',
                './jwtUserLogin/src/*.html',
                './nav-bar/src/*.html'],
                tasks: ['run_grunt:dev']
            },
            css: {
                files: ['./data-collections/src/*.css',
                './dcbia-plots/src/*.css',
                './dcbia-surveys/src/*.css',
                './jwtUserLogin/src/*.css',
                './nav-bar/src/*.css'],
                tasks: ['run_grunt:dev']
            },
            js: {
                files: ['./data-collections/src/*.js',
                './dcbia-plots/src/*.js',
                './dcbia-surveys/src/*.js',
                './jwtUserLogin/src/*.js',
                './nav-bar/src/*.js'],
                tasks: ['run_grunt:dev']
            },
        }
    });

    //load grunt tasks
    grunt.loadNpmTasks('grunt-run-grunt');
    grunt.loadNpmTasks('grunt-contrib-watch');


    //register grunt default task
    grunt.registerTask('default', [ 'run_grunt:prod']);
    //register dev task
    grunt.registerTask('dev', [ 'run_grunt:dev', 'watch']);
}