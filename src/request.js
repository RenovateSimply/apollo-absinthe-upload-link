import { Observable } from 'rxjs/Observable'
import { Subscriber } from 'rxjs/Subscriber'
import 'rxjs/add/observable/dom/ajax'
import 'rxjs/add/operator/map'

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
            formData: opts.body,
            progress: loaded / total,
          };
          const event = new CustomEvent('progressEvent', { detail });
          window.dispatchEvent(event);
        }
      },
      (error) => console.log(error),
      () => console.log('complete'),
    ),
  }).map(({ response }) => response)

export default request
