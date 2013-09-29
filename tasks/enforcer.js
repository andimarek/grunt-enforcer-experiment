var esprima = require("esprima");
var _ = require("underscore");
_.str = require('underscore.string');
_.mixin(_.str.exports());

var htmlparser = require("htmlparser2");

module.exports = function (grunt) {

  var containsTree = function (node, searchFor) {
    if (_.isEqual(node, searchFor)) {
      return true;
    }
    var result = false;
    if (_.isArray(node)) {
      _.each(node, function (arrayElement) {
        result = result || containsTree(arrayElement, searchFor);
      });
      return result;
    }
    _.each(node, function (value, key) {
      if (_.isObject(value)) {
        result = result || containsTree(value, searchFor);
      }
    });
    return result;
  };

  grunt.registerMultiTask('enforcer', 'Enforce something', function () {
    var that = this;

    console.log("Starting enforcer task");

    var expTreesToSearchFor = [];

    _.each(this.options().notAllowedExpressions, function (expr) {
      var program = esprima.parse(expr);
      var expresstionStatement = program.body[0].expression;
      expTreesToSearchFor.push(expresstionStatement);
    });

    var handleJsFile = function (filepath) {
      console.log("Handling js file " + filepath);
      var content = grunt.file.read(filepath);

      var ast = esprima.parse(content);

      _.each(expTreesToSearchFor, function (expression) {
        console.log(containsTree(ast, expression));
      });
    };

    var handleHtmlFile = function (filepath) {
      var htmlElements = {};
      var parser = new htmlparser.Parser({
        onopentag: function (name, attribs) {
          htmlElements[name] = true;
        },
        ontext: function (text) {
        },
        onclosetag: function (tagname) {
        }
      });
      parser.write(grunt.file.read(filepath));
      parser.end();

      htmlElements = _.keys(htmlElements);
      console.log(htmlElements);
      grunt.option(that.options()['customHtmlElementsOptionName'], htmlElements);
    };

    var files = this.filesSrc;
    files.forEach(function (filepath) {
      if (_(filepath).endsWith(".js")) {
        handleJsFile(filepath);
      }
      else if (_(filepath).endsWith(".html")) {
        handleHtmlFile(filepath);
      }
    });
  });

}
;
