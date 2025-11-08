// Disables access to DOM typings like `HTMLElement` which are not available
// inside a service worker and instantiates the correct globals
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

// Ensures that the `$service-worker` import has proper type definitions
/// <reference types="@sveltejs/kit" />

import { registerRoute } from 'workbox-routing';
import {
  NetworkFirst,
  CacheFirst,
  StaleWhileRevalidate
} from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

// Use StaleWhileRevalidate for static
registerRoute(
  /\/.*\.(?:js|css)$/,
  new StaleWhileRevalidate({
    cacheName: 'static',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200]
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        purgeOnQuotaError: true
      })
    ]
  })
);

// Use StaleWhileRevalidate for assets
registerRoute(
  /\/.*\.(?:jpg|json|png)$/,
  new StaleWhileRevalidate({
    cacheName: 'assets',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        purgeOnQuotaError: true
      }),
      new CacheableResponsePlugin({
        statuses: [200]
      })
    ]
  })
);

// Use CacheFirst strategy for tiles
registerRoute(
  ({ url }) => url.hostname.includes('basemaps.cartocdn.com'),
  new CacheFirst({
    cacheName: 'tiles',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200, 404]
      }),
      new ExpirationPlugin({
        maxEntries: 2000, // 2,000 tiles
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        purgeOnQuotaError: true
      })
    ]
  })
);

// Use NetworkFirst strategy for navigation requests
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'index',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200]
      })
    ]
  })
);
