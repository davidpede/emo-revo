module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        modx: grunt.file.readJSON('_build/config.json'),
        sshconfig: grunt.file.readJSON('/Users/jako/Documents/MODx/partout.json'),
        banner: '/*!\n' +
        ' * <%= modx.name %> - <%= modx.description %>\n' +
        ' * Version: <%= modx.version %>\n' +
        ' * Build date: <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' */\n',
        usebanner: {
            css: {
                options: {
                    position: 'top',
                    banner: '<%= banner %>'
                },
                files: {
                    src: [
                        'assets/components/emo/css/emo.min.css'
                    ]
                }
            },
            js: {
                options: {
                    position: 'top',
                    banner: '<%= banner %>'
                },
                files: {
                    src: [
                        'assets/components/emo/js/emo.min.js'
                    ]
                }
            }
        },
        uglify: {
            emo: {
                src: [
                    'source/js/emo.js'
                ],
                dest: 'assets/components/emo/js/emo.min.js'
            }
        },
        sass: {
            options: {
                outputStyle: 'expanded',
                sourcemap: false
            },
            dist: {
                files: {
                    'source/css/emo.css': 'source/sass/emo.scss'
                }
            }
        },
        cssmin: {
            emo: {
                src: [
                    'source/css/emo.css'
                ],
                dest: 'assets/components/emo/css/emo.min.css'
            }
        },
        sftp: {
            css: {
                files: {
                    "./": [
                        'assets/components/emo/css/emo.min.css'
                    ]
                },
                options: {
                    path: '<%= sshconfig.hostpath %>develop/emo/',
                    srcBasePath: 'develop/emo/',
                    host: '<%= sshconfig.host %>',
                    username: '<%= sshconfig.username %>',
                    privateKey: '<%= sshconfig.privateKey %>',
                    passphrase: '<%= sshconfig.passphrase %>',
                    showProgress: true
                }
            },
            js: {
                files: {
                    "./": ['assets/components/emo/js/emo.min.js']
                },
                options: {
                    path: '<%= sshconfig.hostpath %>develop/emo/',
                    srcBasePath: 'develop/emo/',
                    host: '<%= sshconfig.host %>',
                    username: '<%= sshconfig.username %>',
                    privateKey: '<%= sshconfig.privateKey %>',
                    passphrase: '<%= sshconfig.passphrase %>',
                    showProgress: true
                }
            }
        },
        watch: {
            scripts: {
                files: [
                    'source/js/**/*.js'
                ],
                tasks: ['uglify', 'usebanner:js', 'sftp:js']
            },
            css: {
                files: [
                    'source/sass/**/*.scss'
                ],
                tasks: ['sass', 'cssmin', 'usebanner:css', 'sftp:css']
            }
        },
        bump: {
            copyright: {
                files: [{
                    src: 'core/components/emo/model/emo/emo.class.php',
                    dest: 'core/components/emo/model/emo/emo.class.php'
                }],
                options: {
                    replacements: [{
                        pattern: /Copyright 2011(-\d{4})? by/g,
                        replacement: 'Copyright ' + (new Date().getFullYear() > 2011 ? '2011-' : '') + new Date().getFullYear() + ' by'
                    }]
                }
            },
            version: {
                files: [{
                    src: 'core/components/emo/model/emo/emo.class.php',
                    dest: 'core/components/emo/model/emo/emo.class.php'
                }],
                options: {
                    replacements: [{
                        pattern: /version = '\d+.\d+.\d+[-a-z0-9]*'/ig,
                        replacement: 'version = \'' + '<%= modx.version %>' + '\''
                    }]
                }
            }
        }
    });

    //load the packages
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-banner');
    grunt.loadNpmTasks('grunt-ssh');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.renameTask('string-replace', 'bump');

    //register the task
    grunt.registerTask('default', ['bump', 'uglify', 'sass', 'cssmin', 'usebanner', 'sftp']);
};