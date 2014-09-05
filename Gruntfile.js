module.exports = function (grunt) {
    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),
        connect: {
            options: {
                port: 9000,
                hostname: '127.0.0.1', //默认就是这个值，可配置为本机某个 IP，localhost 或域名
                livereload: 35729  //声明给 watch 监听的端口
            },
            server: {
                options: {
                    open: false //自动打开网页 http://
                }
            }
        },
        less: {
            production : {
                options: {
                },
                files: {
                    "style/ui.css": "style/ui.less"
                }
            }
        },
        watch : {
            options: {
                livereload: 35729 // this port must be same with the connect livereload port
            },
            scripts: {
                files:  ['*.html','*.js','style/*.less'],
                tasks: ["lessTask"],
                options: {
                    livereload: true
                }
            }
        }
    });
    grunt.registerTask('default',["connect","less","watch"]);
    grunt.registerTask("lessTask",["less"]);
    grunt.loadNpmTasks('grunt-contrib-less')
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
};