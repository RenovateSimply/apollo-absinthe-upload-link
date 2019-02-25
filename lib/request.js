'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ajax = require('rxjs/ajax');

var _operators = require('rxjs/operators');

var _Subscriber = require('rxjs/Subscriber');

var _customEvent = require('custom-event');

var _customEvent2 = _interopRequireDefault(_customEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Request function
 *
 * @param {Object} opts
 */
var request = function request(opts) {
  return (0, _ajax.ajax)({
    url: opts.uri,
    body: opts.body,
    method: 'POST',
    headers: opts.headers,
    progressSubscriber: _Subscriber.Subscriber.create(function (progressEvent) {
      if (!progressEvent) return;
      var lengthComputable = progressEvent.lengthComputable,
          loaded = progressEvent.loaded,
          total = progressEvent.total;

      if (lengthComputable) {
        var detail = {
          files: opts.files,
          progress: loaded / total
        };
        var event = new _customEvent2.default('progressEvent', { detail: detail });
        window.dispatchEvent(event);
      }
    }, function () {/* error */}, function () {/* complete */})
  }).pipe((0, _operators.map)(function (_ref) {
    var response = _ref.response;
    return response;
  }));
};

exports.default = request;