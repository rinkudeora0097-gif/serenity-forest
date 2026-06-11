import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  const getHmrConfig = () => {
    // If HMR is disabled, return false
    if (process.env.DISABLE_HMR === 'true') {
      return false;
    }

    // Dynamic config for cloud/remote environment
    if (process.env.APP_URL) {
      try {
        const url = new URL(process.env.APP_URL);
        return {
          protocol: 'wss',
          host: url.hostname,
          clientPort: 443,
        };
      } catch {
        // Fallback on invalid URL
      }
    }

    // Default configuration for standard local development
    return {
      protocol: 'ws',
      host: 'localhost',
      clientPort: 3000,
    };
  };

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      hmr: getHmrConfig(),
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('three') || id.includes('@types/three')) {
                return 'vendor-three';
              }
              if (id.includes('firebase') || id.includes('@firebase')) {
                return 'vendor-firebase';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-lucide';
              }
              return 'vendor';
            }
          },
        },
      },
      chunkSizeWarningLimit: 1200,
    },
  };
});
