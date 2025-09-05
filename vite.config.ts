import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), tailwindcss()],
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime', 'react-router-dom'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    sourcemap: false,
    minify: true,
    cssMinify: true,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined

          const groups: Array<{ name: string; test: RegExp }> = [
            { name: 'heroui', test: /node_modules\/@heroui\// },
            { name: 'motion', test: /node_modules\/framer-motion\// },
            { name: 'lucide', test: /node_modules\/lucide-react\// },
            {
              name: 'react-aria',
              test: /node_modules\/@react-(aria|stately|types)\//,
            },
            { name: 'dnd-kit', test: /node_modules\/@dnd-kit\// },
            {
              name: 'react-router',
              test: /node_modules\/(react-router|react-router-dom|@remix-run\/router)\//,
            },
            { name: 'state', test: /node_modules\/zustand\// },
            { name: 'http', test: /node_modules\/axios\// },
            {
              name: 'utils',
              test: /node_modules\/(lodash(?:-es)?|dayjs|clsx)\//,
            },
          ]

          for (const g of groups) {
            if (g.test.test(id)) return g.name
          }

          return 'vendor'
        },
      },
    },
  },
})
