import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import viteApiPlugin from './vite-plugin-api.js'

export default defineConfig({
  plugins: [react(), viteApiPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
