'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Observable = require('rxjs/Observable');

var _Subscriber = require('rxjs/Subscriber');

require('rxjs/add/observable/dom/ajax');

require('rxjs/add/operator/map');

/**
 * Request function
 *
 * @param {Object} opts
 */
var request = function request(opts) {
  return _Observable.Observable.ajax({
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
          formData: opts.body,
          progress: loaded / total
        };
        var event = new CustomEvent('progressEvent', { detail: detail });
        window.dispatchEvent(event);
      }
    }, function () {/* error */}, function () {/* complete */})
  }).map(function (_ref) {
    var response = _ref.response;
    return response;
  });
};

exports.default = request;