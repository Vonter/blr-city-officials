import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';
import radar from 'vite-plugin-radar';
import postcss from './postcss.config.js';

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    css: { postcss },
    plugins: [
      sveltekit(),
      radar({
        analytics: {
          id: process.env.VITE_GOOGLE_ANALYTICS_ID
        }
      })
    ]
  });
};
