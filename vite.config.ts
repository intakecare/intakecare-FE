import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
    base: '',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
      proxy: {
      '/api': {
          target: 'https://intakecare-rct-1ac91b26c754.herokuapp.com/',
          // target: 'http://localhost:3000',
          changeOrigin: true,
          ws: true,
          rewrite: path => path.replace(/^\/api/, '')
      }
      }
  }
})
