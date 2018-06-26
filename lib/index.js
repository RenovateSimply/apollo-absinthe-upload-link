'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReactNativeFile = exports.createLink = exports.createUploadMiddleware = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _validators = require('./validators');

Object.defineProperty(exports, 'ReactNativeFile', {
  enumerable: true,
  get: function get() {
    return _validators.ReactNativeFile;
  }
});

var _apolloLinkHttp = require('apollo-link-http');

var _apolloLink = require('apollo-link');

var _apolloClient = require('apollo-client');

var _request = require('./request');

var _request2 = _interopRequireDefault(_request);

var _extractFiles2 = require('./extractFiles');

var _extractFiles3 = _interopRequireDefault(_extractFiles2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createUploadMiddleware = exports.createUploadMiddleware = function createUploadMiddleware(_ref) {
  var uri = _ref.uri,
      headers = _ref.headers;
  return new _apolloLink.ApolloLink(function (operation, forward) {
    if (typeof FormData !== 'undefined' && (0, _validators.isObject)(operation.variables)) {
      var _extractFiles = (0, _extractFiles3.default)(operation.variables),
          variables = _extractFiles.variables,
          files = _extractFiles.files;

      if (files.length > 0) {
        var _operation$getContext = operation.getContext(),
            contextHeaders = _operation$getContext.headers;

        var formData = new FormData();

        formData.append('query', (0, _apolloClient.printAST)(operation.query));
        formData.append('variables', JSON.stringify(variables));
        files.forEach(function (_ref2) {
          var name = _ref2.name,
              file = _ref2.file;
          return formData.append(name, file);
        });

        return (0, _request2.default)({
          uri: uri,
          body: formData,
          headers: _extends({}, contextHeaders, headers)
        });
      }
    }

    return forward(operation);
  });
};

var createLink = exports.createLink = function createLink(opts) {
  return (0, _apolloLink.concat)(createUploadMiddleware(opts), new _apolloLinkHttp.HttpLink(opts));
};