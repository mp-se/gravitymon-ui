import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'src/tests/setup.js',
    coverage: {
      provider: 'istanbul',
      include: ['src/**/*.{js,vue}'],
      exclude: [
        'src/tests/**',
        'src/**/__tests__/**',
        'src/main.js'
      ],
      reporter: ['text', 'lcov', 'html'],
      reportsDirectory: './coverage'
    }
  }
})
