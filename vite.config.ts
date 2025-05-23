import { defineConfig } from 'vite';
import devConfig from './vite.config.dev.ts';
import prodConfig from './vite.config.prod.ts';

export default defineConfig(({ mode }) => {
  if (mode === 'development') {
    return devConfig;
  } else {
    return prodConfig;
  }
});