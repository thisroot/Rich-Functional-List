module.exports = function(grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            dist: {
                src: [
                    'rich-functional-list/partials/plugin.intro.js',
                    'rich-functional-list/partials/plugin.variables.js',
                    'rich-functional-list/partials/plugin.functions.js',
                    'rich-functional-list/partials/plugin.listeners.js',
                    'rich-functional-list/partials/jquery/jquery.rfl-plugin-start.js',
                    'rich-functional-list/partials/jquery/jquery.rfl-public.js',
                    'rich-functional-list/partials/jquery/jquery.rfl-animations.js',
                    'rich-functional-list/partials/RichList/RL.class.js',
                    'rich-functional-list/partials/RichList/RL.listeners.js',
                    'rich-functional-list/partials/RichList/RL.events.js',
                    'rich-functional-list/partials/RichList/RL.items.js',
                    'rich-functional-list/partials/RichList/RL.mouse.js',
                    'rich-functional-list/partials/RichList/RL.triggers.js',
                    'rich-functional-list/partials/plugin.outro.js'
                ],
                dest: 'rich-functional-list/jquery.rich-functional-list.js'
            }
        },
        uglify: {
            my_target: {
                files: {
                    '../public/view.min.js': 'view.js',
                    '../public/controllers/controller.min.js': 'controllers/controller.js',
                    '../public/controllers/data-access.min.js': 'controllers/data-access.js',
                    '../public/controllers/parse-data.min.js': 'controllers/parse-data.js',
                    '../public/controllers/parse-dom.min.js': 'controllers/parse-dom.js',
                    '../public/rich-functional-list/jquery.rich-functional-list.min.js': 'rich-functional-list/jquery.rich-functional-list.js'
                }
            }
        },
        /*postcss: {
            options: {
                processors: [
                    require('autoprefixer')({browsers: ['last 1 version']})
                ]
            },
            dist: {
                src: 'styles/styles.css'
            }
        },*/
        cssmin: {
            target: {
                files: {
                    '../public/styles/styles.min.css': 'styles/styles.css'
                }
            }
        },
        copy: {
            saveJson: {
                expand: true,
                dest: '../public/',
                filter: 'isFile',
                src: [
                    'data/save-json-data.php'
                ]
            }
        }
    });

    grunt.registerTask('default', ['concat', 'uglify', 'cssmin', 'copy']);
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-postcss');
};
