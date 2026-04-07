import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/proxy/uat': {
        target: 'https://203.150.143.180',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/proxy\/uat/, ''),
      },
      '/proxy/prod': {
        target: 'https://phr1.moph.go.th',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/proxy\/prod/, ''),
      },
      '/proxy/auth': {
        target: 'https://cvp1.moph.go.th',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/proxy\/auth/, ''),
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
  },
})
