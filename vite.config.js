import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  server: {
    host: '0.0.0.0'
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/lib/bubbler.ts'),
      name: 'bubbler',
      fileName: 'bubbler',
    },
  },
  plugins: [dts()],
});