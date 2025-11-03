import { defineConfig } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    // Create 200.html as a fallback copy of index.html for static hosts (e.g., Surge)
    {
      name: 'spa-200-fallback',
      closeBundle() {
        const outDir = 'dist'
        const indexPath = path.join(outDir, 'index.html')
        const twoHundredPath = path.join(outDir, '200.html')
        try {
          if (fs.existsSync(indexPath)) {
            fs.copyFileSync(indexPath, twoHundredPath)
          }
        } catch (err) {
          // Non-fatal: build output still valid without 200.html
        }
      }
    },
    // Bundle analyzer
    mode === 'analyze' && visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    })
  ].filter(Boolean),
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2015', // Better compatibility for older devices
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('react-router')) {
              return 'router';
            }
            if (id.includes('jspdf') || id.includes('html2canvas')) {
              return 'pdf-vendor';
            }
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            return 'vendor';
          }
          
          // Component chunks
          if (id.includes('src/sections/QuizGeneratorPage')) {
            return 'quiz-generator';
          }
          if (id.includes('src/sections/') && !id.includes('HeroSection')) {
            return 'sections';
          }
          if (id.includes('src/components/')) {
            return 'components';
          }
          if (id.includes('src/AnimatedBackground/')) {
            return 'animated-bg';
          }
        },
        // Optimize chunk sizes
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // Increase chunk size warning limit for large dependencies like PDF libraries
    chunkSizeWarningLimit: 600, // Increased to accommodate large PDF libraries
    assetsInlineLimit: 2048,
    // Enable brotli compression
    brotliSize: true,
    // Enable CSS optimization
    cssMinify: true
  },
  base: '/',
  // Optimize dev server for faster development
  server: {
    hmr: {
      overlay: false
    },
    // Enable compression in dev mode
    compress: true
  },
  // Optimize for production
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'lucide-react'],
    exclude: ['jspdf', 'html2canvas'] // These are large and better loaded on demand
  }
}))