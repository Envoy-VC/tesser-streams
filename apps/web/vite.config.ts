import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(async ({ mode }) => {
  // @ts-ignore assign read-only env for build, load all env vars
  import.meta.env = loadEnv(mode, process.cwd(), '');
  const { env } = await import('./src/env');
  return {
    envPrefix: ['VITE_'],
    plugins: [TanStackRouterVite({}), react(), tailwindcss()],
    build: {
      sourcemap: true,
    },
    server: { port: env.PORT },
    publicDir: 'public',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        public: path.resolve(__dirname, './public'),
      },
    },
  };
});
