import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

export default defineConfig(({ mode }) => {
  const root = fileURLToPath(new URL('.', import.meta.url));
  const env = loadEnv(mode, root, '');
  const isProd = mode === 'production';
  const defaultBackend = isProd ? 'https://admin.a1laparoscopyhospital.com' : 'http://127.0.0.1:8000';
  const backendUrl = process.env.VITE_BACKEND_URL || env.VITE_BACKEND_URL || env.NEXT_PUBLIC_BACKEND_URL || defaultBackend;

  return {
    plugins: [
      react(),
      {
        name: 'copy-to-next',
        closeBundle() {
          try {
            const distDir = path.join(root, 'dist');
            const nextDir = path.join(root, '.next');
            if (fs.existsSync(distDir)) {
              fs.cpSync(distDir, nextDir, { recursive: true, force: true });
            }
          } catch (e) {
            console.warn('Could not copy to .next directory:', e.message);
          }
        }
      }
    ],
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    define: {
      'import.meta.env.VITE_BACKEND_URL': JSON.stringify(backendUrl),
    },
    server: {
      host: '127.0.0.1', port: 3000, strictPort: true,
      proxy: {
        '/sitemap.xml': { target: backendUrl, changeOrigin: true },
        '/api/sitemap.xml': { target: backendUrl, changeOrigin: true, rewrite: () => '/sitemap.xml' },
      },
    },
    build: { outDir: 'dist' },
  };
});
