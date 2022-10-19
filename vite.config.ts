import solid from 'solid-start/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [solid({ ssr: false })],
  define: { global: {} },
  resolve: { alias: { stream: 'stream-browserify' } },
});
