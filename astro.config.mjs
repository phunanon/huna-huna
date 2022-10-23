import { defineConfig } from 'astro/config';
import solid from '@astrojs/solid-js';

//https://astro.build/config
//https://stackoverflow.com/a/73095593
export default defineConfig({
  integrations: [solid()],
  site: 'https://phunanon.github.io',
  base: '/huna-huna',
  vite: {
    resolve: {
      alias: {
        'node-fetch': 'fetch-ponyfill',
        stream: 'stream-browserify',
      },
    },
  },
});
