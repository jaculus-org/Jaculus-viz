import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import { fileURLToPath, URL } from 'node:url'
import path from 'path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // Please make sure that '@tanstack/router-plugin' is passed before '@vitejs/plugin-react'
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    {
      name: 'copy-src-assets',
      apply: 'build',
      closeBundle() {
        const src = path.resolve(__dirname, 'src/assets')
        const dest = path.resolve(__dirname, 'dist/assets')
        if (fs.existsSync(src)) {
          fs.mkdirSync(dest, { recursive: true })
          for (const file of fs.readdirSync(src)) {
            fs.copyFileSync(path.join(src, file), path.join(dest, file))
          }
        }
      },
    },
  ],
  base: './',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@/components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@/context': fileURLToPath(new URL('./src/context', import.meta.url)),
      '@/routes': fileURLToPath(new URL('./src/routes', import.meta.url)),
      '@/utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
      '@/assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // ...existing code...
      },
    },
    // Copy static assets from src/assets to dist/assets
    assetsDir: 'assets',
    emptyOutDir: true,
  },
  publicDir: 'public',
})
