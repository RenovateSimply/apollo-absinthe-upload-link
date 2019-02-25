'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReactNativeFile = exports.createLink = exports.createUploadMiddleware = undefined;

var _validators = require('./validators');

Object.defineProperty(exports, 'ReactNativeFile', {
  enumerable: true,
  get: function get() {
    return _validators.ReactNativeFile;
  }
});

var _apolloLinkHttp = require('apollo-link-http');

var _apolloLink = require('apollo-link');

var _printer = require('graphql/language/printer');

var _request = require('./request');

var _request2 = _interopRequireDefault(_request);

var _extractFiles2 = require('./extractFiles');

var _extractFiles3 = _interopRequireDefault(_extractFiles2);

var _apolloLinkHttpCommon = require('apollo-link-http-common');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createUploadMiddleware = exports.createUploadMiddleware = function createUploadMiddleware(_ref) {
  var uri = _ref.uri,
      headers = _ref.headers,
      fetch = _ref.fetch;
  return new _apolloLink.ApolloLink(function (operation, forward) {
    if (typeof FormData !== 'undefined' && (0, _validators.isObject)(operation.variables)) {
      var _extractFiles = (0, _extractFiles3.default)(operation.variables),
          variables = _extractFiles.variables,
          files = _extractFiles.files;

      if (files.length > 0) {
        var context = operation.getContext();
        var contextHeaders = context.headers;

        var formData = new FormData();

        formData.append('query', (0, _printer.print)(operation.query));
        formData.append('variables', JSON.stringify(variables));

        /**
         * Third param in append specifies filename.
         *
         * Ref: https://developer.mozilla.org/en-US/docs/Web/API/FormData/append
         */
        files.forEach(function (_ref2) {
          var name = _ref2.name,
              file = _ref2.file;
          return formData.append(name, file, file.name);
        });

        var options = {
          method: 'POST',
          headers: Object.assign({}, contextHeaders, headers),
          body: formData

          // add context.fetchOptions to fetch options
        };options = Object.assign(context.fetchOptions || {}, options);

        // is there a custom fetch? then use it
        if (fetch) {
          return new _apolloLink.Observable(function (observer) {
            fetch(uri, options).then(function (response) {
              operation.setContext({ response: response });
              return response;
            }).then((0, _apolloLinkHttpCommon.parseAndCheckHttpResponse)(operation)).then(function (result) {
              // we have data and can send it to back up the link chain
              observer.next(result);
              observer.complete();
              return result;
            }).catch(function (err) {
              if (err.result && err.result.errors && err.result.data) {
                observer.next(err.result);
              }
              observer.error(err);
            });
          });
        } else {
          return (0, _request2.default)({
            uri: uri,
            body: formData,
            headers: Object.assign({}, contextHeaders, headers),
            files: files
          });
        }
      }
    }

    return forward(operation);
  });
};

var createLink = exports.createLink = function createLink(opts) {
  return (0, _apolloLink.concat)(createUploadMiddleware(opts), new _apolloLinkHttp.HttpLink(opts));
};