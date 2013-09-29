module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-processhtml');

  var initConfig = {
    enforcer: {
      example: {
        src: ['src/*.html','src/*.js'],
        options: {
          notAllowedExpressions: ['console.log','iit'],
          customHtmlElementsOptionName: 'customHtmlElements'
        }
      }
    },
    processhtml: {
      options: {
        data: {
          message: 'Hello world!'
        }
      },
      dist: {
        files: {
          'dest/index.html': ['index.html']
        }
      }
    }
  };

  grunt.registerTask('test', 'test', function () {
    console.log(JSON.stringify(grunt.option('customHtmlElements')));
  });

  grunt.registerTask('')

  grunt.loadTasks("../tasks");
  grunt.initConfig(initConfig);

  grunt.registerTask("default", ["enforcer:example","test"]);
};
