import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const paperlessUrl = env.VITE_PAPERLESS_URL || 'localhost:8000';
  const paperlessToken = env.PAPERLESS_API_TOKEN || '';
  const target = paperlessUrl.startsWith('http') ? paperlessUrl : `http://${paperlessUrl}`;

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      proxy: {
        '/api/paperless': {
          target,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/paperless/, '/api'),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (paperlessToken) {
                proxyReq.setHeader('Authorization', `Token ${paperlessToken}`);
              }
            });
          },
        },
      },
    },
  };
});
