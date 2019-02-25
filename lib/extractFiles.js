'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _validators = require('./validators');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var extractFiles = function extractFiles(variables) {
  var files = [];
  var walkTree = function walkTree(tree) {
    var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    var mapped = Array.isArray(tree) ? tree : Object.assign({}, tree);
    Object.keys(mapped).forEach(function (key) {
      var value = mapped[key];
      var name = [].concat(_toConsumableArray(path), [key]).join('.');

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