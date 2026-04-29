import { defineConfig } from 'vite'

export default defineConfig({
  base: '/my-ar-app/',
    server: {
    https: true,
    host: true
  },
  build: {
    outDir: 'dist'
  }
})