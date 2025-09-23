import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';
import postcss from './postcss.config.js';

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  process.env = { ...process.env, ...env };

  return defineConfig({
    css: { postcss },
    plugins: [sveltekit()],
    define: {
      'import.meta.env.VITE_CITY': JSON.stringify(env.VITE_CITY || 'blr')
    }
  });
};
