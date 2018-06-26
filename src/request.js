import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'
import 'rxjs/add/observable/dom/ajax'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/merge'

/**
 * Request function
 *
 * @param {Object} opts
 */
const request = (opts) => {
  const progressSubscriber = new Subject();
  const obs = Observable.ajax({
    url: opts.uri,
    body: opts.body,
    method: 'POST',
    headers: opts.headers,
    progressSubscriber,
  });
  progressSubscriber.merge(obs).subscribe((progressEvent) => {
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
  });
  return obs.map(({ response }) => response);
};

export default request
