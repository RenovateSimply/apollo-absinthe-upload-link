'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ramda = require('ramda');

var _validators = require('./validators');

var extractFiles = function extractFiles(variables) {
  var files = [];
  var walkTree = function walkTree(tree) {
    var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    var mapped = Array.isArray(tree) ? tree : Object.assign({}, tree);
    Object.keys(mapped).forEach(function (key) {
      var value = mapped[key];
      var name = (0, _ramda.pipe)((0, _ramda.append)(key), (0, _ramda.join)('.'))(path);

      if ((0, _validators.isUploadFile)(value) || (0, _validators.isFileList)(value)) {
        var file = (0, _validators.isFileList)(value) ? Array.prototype.slice.call(value) : value;

        files.push({ file: file, name: name });
        mapped[key] = name;
      } else if ((0, _validators.isObject)(value)) {
        mapped[key] = walkTree(value, name);
      }
    });

    return mapped;
  };

  return {
    files: files,
    variables: walkTree(variables)
  };
};

exports.default = extractFiles;