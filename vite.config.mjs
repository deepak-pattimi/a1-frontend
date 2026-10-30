import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig(({ mode }) => {
  const root = fileURLToPath(new URL('.', import.meta.url));
  const env = loadEnv(mode, root, '');
  return {
    plugins: [react()],
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    // Only public URLs are exposed; never expose all process.env values.
    define: {
      'import.meta.env.VITE_BACKEND_URL': JSON.stringify(process.env.VITE_BACKEND_URL || env.VITE_BACKEND_URL || env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000'),
    },
    server: {
      host: '127.0.0.1', port: 3000, strictPort: true,
      proxy: {
        '/sitemap.xml': { target: process.env.VITE_BACKEND_URL || env.VITE_BACKEND_URL || 'http://127.0.0.1:8000', changeOrigin: true },
        '/api/sitemap.xml': { target: process.env.VITE_BACKEND_URL || env.VITE_BACKEND_URL || 'http://127.0.0.1:8000', changeOrigin: true, rewrite: () => '/sitemap.xml' },
      },
    },
    build: { outDir: 'dist' },
  };
});
