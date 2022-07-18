// Creator: k6 Browser Recorder 0.6.2 (+ handmade cleanups)
import { check, group } from 'k6';
import http from 'k6/http';

import getHeaders from './utils/getHeaders.js';
import { StoreConfigQueryString } from '../../../query/storeConfig.gql.js';

/**
 * @type {import('k6/options').Options}
 */
export const options = {
  vus: 1,
  duration: '5s',
};

const { BASE_URL } = __ENV;

if (BASE_URL === undefined) {
  throw new Error('BASE_URL is not set');
}

export default function main() {
  const params = {
    headers: getHeaders(),
  };

  group('[Magento] storeConfig', () => {
    const response = http.get(
      `${BASE_URL}?${StoreConfigQueryString}`,
      params,
    );

    check(response, {
      'is status 200': (r) => r.status === 200,
      'does not have errors': (r) => !r.json().errors,
      'includes cart data': (r) => r.body.includes('storeConfig'),
    });
  });
}
