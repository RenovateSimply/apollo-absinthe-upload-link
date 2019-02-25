'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var isObject = exports.isObject = function isObject(value) {
  return value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object';
};

var isFileList = exports.isFileList = function isFileList(value) {
  return typeof FileList !== 'undefined' && value instanceof FileList;
};

var isUploadFile = exports.isUploadFile = function isUploadFile(value) {
  return typeof File !== 'undefined' && value instanceof File || typeof Blob !== 'undefined' && value instanceof Blob || value instanceof ReactNativeFile;
};

/**
 * A React Native FormData file object.
 * @see {@link https://github.com/facebook/react-native/blob/v0.45.1/Libraries/Network/FormData.js#L34}
 * @typedef {Object} ReactNativeFileObject
 * @property {String} uri - File system path.
 * @property {String} [type] - File content type.
 * @property {String} [name] - File name.
 */

/**
 * A React Native file.
 */

var ReactNativeFile =
/**
 * Constructs a new file.
 * @param {ReactNativeFileObject} file
 * @example
 * const file = new ReactNativeFile({
 *  uri: uriFromCameraRoll,
 *  type: 'image/jpeg',
 *  name: 'photo.jpg'
 * })
 */
exports.ReactNativeFile = function ReactNativeFile(_ref) {
  var uri = _ref.uri,
      type = _ref.type,
      name = _ref.name;

  _classCallCheck(this, ReactNativeFile);

  this.uri = uri;
  this.type = type;
  this.name = name;
}

/**
 * Creates an array of file instances.
 * @param {ReactNativeFileObject[]} files
 * @example
 * const files = ReactNativeFile.list([{
 *   uri: uriFromCameraRoll1,
 *   type: 'image/jpeg',
 *   name: 'photo-1.jpg'
 * }, {
 *   uri: uriFromCameraRoll2,
 *   type: 'image/jpeg',
 *   name: 'photo-2.jpg'
 * }])
 */
;

ReactNativeFile.list = function (files) {
  return files.map(function (file) {
    return new ReactNativeFile(file);
  });
};