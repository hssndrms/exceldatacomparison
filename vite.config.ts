import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { fileURLToPath } from 'node:url';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: '/exceldatacomparison/', // GitHub Pages için repo adınızı yazın
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          // Fix: __dirname is not available in ES modules. Use import.meta.url to get the current directory path.
          '@': path.dirname(fileURLToPath(import.meta.url)),
        }
      }
    };
});
