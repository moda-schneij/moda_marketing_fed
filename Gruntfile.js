/* global module:false, require:false */
module.exports = function(grunt) {

    var port = grunt.option('port') || 9000;

    //LiveReload Middleware setup

    // This is the default port that livereload listens on;
    // change it if you configure livereload to use another port.
    var LIVERELOAD_PORT = 35729;
    // lrSnippet is just a function.
    // It's a piece of Connect middleware that injects
    // a script into the static served html.
    var lrSnippet = require('connect-livereload')({ port: LIVERELOAD_PORT });
    // All the middleware necessary to serve static files.
    var livereloadMiddleware = function (connect, options) {
      return [
        // Inject a livereloading script into static files.
        lrSnippet,
        // Serve static files.
        connect.static(options.base),
        // Make empty directories browsable.
        connect.directory(options.base)
      ];
    };

    // Dependencies
    require('load-grunt-tasks')(grunt);

    // Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            banner:
                '/*!\n' +
                ' * reveal.js <%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd, HH:MM") %>)\n' +
                ' * http://lab.hakim.se/reveal-js\n' +
                ' * MIT licensed\n' +
                ' *\n' +
                ' * Copyright (C) 2013 Hakim El Hattab, http://hakim.se\n' +
                ' */'
        },

        qunit: {
            files: [ 'test/*.html' ]
        },

        uglify: {
            options: {
                banner: '<%= meta.banner %>\n'
            },
            build: {
                src: 'js/reveal.js',
                dest: 'js/reveal.min.js'
            }
        },

        cssmin: {
            compress: {
                files: {
                    'css/reveal.min.css': [ 'css/reveal.css' ]
                }
            }
        },

        sass: {
            main: {
                files: {
                    'css/theme/default.css': 'css/theme/source/default.scss',
                    'css/theme/beige.css': 'css/theme/source/beige.scss',
                    'css/theme/night.css': 'css/theme/source/night.scss',
                    'css/theme/serif.css': 'css/theme/source/serif.scss',
                    'css/theme/simple.css': 'css/theme/source/simple.scss',
                    'css/theme/sky.css': 'css/theme/source/sky.scss',
                    'css/theme/moon.css': 'css/theme/source/moon.scss',
                    'css/theme/solarized.css': 'css/theme/source/solarized.scss',
                    'css/theme/blood.css': 'css/theme/source/blood.scss',
                    'css/theme/mktfed.css': 'css/theme/source/mktfed.scss'
                }
            }
        },

        jshint: {
            options: {
                curly: false,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                eqnull: true,
                browser: true,
                expr: true,
                globals: {
                    head: false,
                    module: false,
                    console: false,
                    unescape: false
                }
            },
            files: [ 'Gruntfile.js', 'js/reveal.js' ]
        },

        connect: {
            server: {
                options: {
                    port: port,
                    base: '.',
                    middleware: livereloadMiddleware,
                    hostname: '*'
                }
            }
        },
        
        open: {
            all: {
                //files: { src: ['./index.html'] },
                path: 'http://127.0.0.1:<%= connect.server.options.port %>',
                app: 'chrome'
            }
        },

        compress: {
            main: {
                options: {
                    archive: 'reveal-js-presentation.zip'
                },
                files:  [{
                    src: ['index.html',
                        'css/**',
                        'js/**',
                        'lib/**',
                        'images/**',
                        'plugin/**'
                    ],
                    dest: './',
                    filter: 'isFile'
                }]
                    
            }
           
        },

        watch: {
            main: {
                files: [ 'Gruntfile.js', 'index.html', 'js/reveal.js', 'css/reveal.css' ],
                tasks: 'default',
                options: {
                    livereload: LIVERELOAD_PORT
                }
            },
            theme: {
                 files: [ 'css/theme/source/*.scss', 'css/theme/template/*.scss' ],
                 tasks: 'themes',
                 options: {
                     livereload: LIVERELOAD_PORT
                 }
            }
        }

    });


    // Default task
    grunt.registerTask( 'default', [ 'jshint', 'cssmin', 'uglify', 'qunit' ] );

    // Theme task
    grunt.registerTask( 'themes', [ 'sass' ] );

    // Package presentation to archive
    grunt.registerTask( 'package', [ 'default', 'compress' ] );

    // Serve presentation locally
    grunt.registerTask( 'serve', [ 'connect', 'open', 'watch' ] );

    // Run tests
    grunt.registerTask( 'test', [ 'jshint', 'qunit' ] );

};
