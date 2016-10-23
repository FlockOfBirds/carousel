"use strict";
var webpackConfig = require("./webpack.config");
var webpackConfigWatch = Object.assign({}, webpackConfig, {
    watch: true
});
module.exports = function(grunt) {
    var pkg = grunt.file.readJSON("package.json");
    grunt.initConfig({
        pkgName: pkg.name,
        name: pkg.name,
        watch: {
            updateWidgetFiles: {
                "files": [ "./dist/tmp/src/**/*" ],
                "tasks": [ "compress:dist", "copy:distDeployment", "copy:mpk" ],
                options: {
                    debounceDelay: 250,
                    livereload: true
                }
            },
            sourceFiles: {
                "files": [ "./src/**/*", "!./src/**/*.ts", "!./src/**/*.tsx" ],
                "tasks": [ "copy:source" ]
            }
        },
        
        compress: {
            dist: {
                options: {
                    archive: "./dist/" + pkg.version + "/" + pkg.name + ".mpk",
                    mode: "zip"
                },
                files: [{
                    expand: true,
                    date: new Date(),
                    store: false,
                    cwd: "./dist/tmp/src",
                    src: [ "**/*" ]
                }]
            }
        },
        
        copy: {
            distDeployment: {
                files: [
                    { dest: "./MxTestProject/deployment/web/widgets", cwd: "./dist/tmp/src/", src: ["**/*"], expand: true }
                ]
            },
            mpk: {
                files: [
                    { dest: "./MxTestProject/widgets", cwd: "./dist/" + pkg.version + "/", src: [ pkg.name + ".mpk"], expand: true }
                ]
            },
            source: {
                files: [
                    { dest: "./dist/tmp/src", cwd: "./src/", src: ["**/*", "!**/*.ts", "!**/*.tsx"], expand: true }
                ]
            }         
        },
        
        webpack: {
            watch: webpackConfigWatch,            
            renderer: webpackConfig
        },

        clean: {
            build: [
                "./dist/" + pkg.version + "/" + pkg.name + "/*",
                "./MxTestProject/deployment/web/widgets/" + pkg.name + "/*",
                "./MxTestProject/widgets/" + pkg.name + ".mpk"
            ], 
            dist : "./dist/**/*"               
        }
    });
    
    grunt.loadNpmTasks("grunt-contrib-compress");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-webpack");

    grunt.registerTask("default", [ "clean:build", "webpack:watch" ,"compress:dist", "copy:mpk" , "watch" ]);    
    grunt.registerTask(
        "clean build",
        "Compiles all the assets and copies the files to the build directory.", [ "clean:build", "webpack:renderer" ,"compress:dist", "copy:mpk" ]
    );
    grunt.registerTask("build", [ "clean build" ]);
};
