import * as  path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["4c46-2407-aa80-314-8e9f-6523-ce3-b327-cd04.ngrok-free.app", "29fd5cec1a0b.ngrok-free.app"],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
