import { Observable } from 'rxjs/Observable'
import { Subscriber } from 'rxjs/Subscriber'
import 'rxjs/add/observable/dom/ajax'
import 'rxjs/add/operator/map'
import CustomEvent from 'custom-event';

/**
 * Request function
 *
 * @param {Object} opts
 */
const request = opts =>
  Observable.ajax({
    url: opts.uri,
    body: opts.body,
    method: 'POST',
    headers: opts.headers,
    progressSubscriber: Subscriber.create(
      (progressEvent) => {
        if (!progressEvent) return;
        const { lengthComputable, loaded, total } = progressEvent;
        if (lengthComputable) {
          const detail = {
            files: opts.files,
            progress: loaded / total,
          };
          const event = new CustomEvent('progressEvent', { detail });
          window.dispatchEvent(event);
        }
      },
      () => { /* error */ },
      () => { /* complete */ },
    ),
  }).map(({ response }) => response)

export default request
