'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Observable = require('rxjs/Observable');

var _Subject = require('rxjs/Subject');

require('rxjs/add/observable/dom/ajax');

require('rxjs/add/operator/map');

require('rxjs/add/operator/merge');

/**
 * Request function
 *
 * @param {Object} opts
 */
var request = function request(opts) {
  var progressSubscriber = new _Subject.Subject();
  var obs = _Observable.Observable.ajax({
    url: opts.uri,
    body: opts.body,
    method: 'POST',
    headers: opts.headers,
    progressSubscriber: progressSubscriber
  });
  progressSubscriber.merge(obs).subscribe(function (progressEvent) {
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
  });
  return obs.map(function (_ref) {
    var response = _ref.response;
    return response;
  });
};

exports.default = request;