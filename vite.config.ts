import { defineConfig, loadEnv } from 'vite';
import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import postcss from './postcss.config.js';
import { VitePluginRadar } from 'vite-plugin-radar';

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  console.log('Building for /', process.env.VITE_BASE_URL);

  return defineConfig({
    css: { postcss },
    preprocess: [vitePreprocess({ script: true })],
    plugins: [
      svelte(),
      VitePluginRadar({
        analytics: {
          id: process.env.VITE_GOOGLE_ANALYTICS_ID
        }
      })
    ],
    base: process.env.VITE_BASE_URL ? `/${process.env.VITE_BASE_URL}/` : './'
  });
};
