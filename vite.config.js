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
    minify: 'terser',
    cssCodeSplit: false,
    sourcemap: false,
    target: 'es2015',
    chunkSizeWarningLimit: 1000, // Disable chunk size warning (default is 500kB)
    terserOptions: {
      compress: {
        drop_console: false, // Keep console for debugging
        drop_debugger: true,
        passes: 2,
        unsafe: false, // Disable unsafe optimizations that might break code
        unsafe_comps: false,
        unsafe_Function: false,
        unsafe_math: false,
        unsafe_methods: false,
        unsafe_proto: false,
        unsafe_regexp: false,
        unsafe_undefined: false,
        side_effects: false
      },
      mangle: {
        properties: false // Disable property mangling to avoid breaking Vue
      },
      format: {
        comments: false
      }
    },
    rollupOptions: {
      treeshake: true, // Use default tree-shaking instead of aggressive preset
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
