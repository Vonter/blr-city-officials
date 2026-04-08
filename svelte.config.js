import adapter from '@sveltejs/adapter-cloudflare';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      routes: {
        include: ['/*'],
        exclude: [
          '<build>',
          '<prerendered>',
          '/favicon.png',
          '/manifest.webmanifest',
          '/apple-touch-icon.png',
          '/sharecard.jpg',
          '/sharecard.png',
          '/boundaries.json',
          '/icons/*',
          '/blr/*.json',
          '/chennai/*.json',
          '/delhi/*.json',
          '/hyd/*.json',
          '/kolkata/*.json',
          '/mumbai/*.json',
          '/pune/*.json'
        ]
      }
    })
  },
  preprocess: preprocess()
};

export default config;
