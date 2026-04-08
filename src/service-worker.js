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

const cacheableOk = new CacheableResponsePlugin({ statuses: [200] });

// JS and CSS bundles — immutable hashed filenames, serve from cache
registerRoute(
  /\/.*\.(?:js|css)$/,
  new StaleWhileRevalidate({
    cacheName: 'static',
    plugins: [
      cacheableOk,
      new ExpirationPlugin({
        maxAgeSeconds: 30 * 24 * 60 * 60,
        purgeOnQuotaError: true
      })
    ]
  })
);

// City boundary and official JSON data — large files, cache per city
// Matches patterns like /blr/boundaries.json, /mumbai/officials.json,
// /blr/boundaries_bbmp_wards.json etc.
registerRoute(
  ({ url }) =>
    /^\/[a-z]+\/(boundaries|officials)/.test(url.pathname) &&
    url.pathname.endsWith('.json'),
  new StaleWhileRevalidate({
    cacheName: 'city-data',
    plugins: [
      cacheableOk,
      new ExpirationPlugin({
        maxEntries: 200,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        purgeOnQuotaError: true
      })
    ]
  })
);

// Other static assets (images, icons, manifest)
registerRoute(
  /\/.*\.(?:jpg|png|svg|ico|webmanifest)$/,
  new CacheFirst({
    cacheName: 'assets',
    plugins: [
      cacheableOk,
      new ExpirationPlugin({
        maxAgeSeconds: 30 * 24 * 60 * 60,
        purgeOnQuotaError: true
      })
    ]
  })
);

// Carto basemap style JSON — cache-first so map init doesn't wait on network
registerRoute(
  ({ url }) =>
    url.hostname.includes('basemaps.cartocdn.com') &&
    url.pathname.endsWith('style.json'),
  new CacheFirst({
    cacheName: 'basemap-styles',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxAgeSeconds: 7 * 24 * 60 * 60,
        purgeOnQuotaError: true
      })
    ]
  })
);

// Map tiles
registerRoute(
  ({ url }) =>
    url.hostname.includes('basemaps.cartocdn.com') &&
    !url.pathname.endsWith('style.json'),
  new CacheFirst({
    cacheName: 'tiles',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 2000,
        maxAgeSeconds: 30 * 24 * 60 * 60,
        purgeOnQuotaError: true
      })
    ]
  })
);

// Navigation requests (/, /blr, /mumbai, etc.) — network first with offline fallback
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'pages',
    plugins: [cacheableOk]
  })
);
