import { ajax } from 'rxjs/ajax'
import { map } from 'rxjs/operators'
import { Subscriber } from 'rxjs/Subscriber'
import CustomEvent from 'custom-event';

/**
 * Request function
 *
 * @param {Object} opts
 */
const request = opts =>
  ajax({
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
  }).pipe(map(({ response }) => response))

export default request
