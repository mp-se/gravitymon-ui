import { fileURLToPath, URL } from 'node:url'
import viteCompression from 'vite-plugin-compression'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // Remove comments and whitespace in production
          hoistStatic: true,
          cacheHandlers: true
        }
      }
    }),
    viteCompression({
      algorithm: 'gzip',
      threshold: 1024,
      deleteOriginFile: false
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  define: {
    __VUE_OPTIONS_API__: false, // Disable Options API if not used
    __VUE_PROD_DEVTOOLS__: false
  },
  build: {
    minify: 'esbuild',
    cssCodeSplit: false,
    sourcemap: false,
    target: 'es2015',
    chunkSizeWarningLimit: 1000, // Disable chunk size warning (default is 500kB)
    rollupOptions: {
      treeshake: true,
      onwarn(warning, warn) {
        // Suppress eval warnings for formula calculations
        if (warning.code === 'EVAL' && warning.id?.includes('formula.js')) {
          return
        }
        warn(warning)
      },
      output: {
        inlineDynamicImports: true,
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
        manualChunks: undefined
      }
    }
  }
})
