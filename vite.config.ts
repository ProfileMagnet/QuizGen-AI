import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
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
    // Optimize for smaller bundles
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 4096 // Inline small assets
  },
  base: './',
  // Optimize dev server for faster development
  server: {
    hmr: {
      overlay: false
    }
  }
}))
