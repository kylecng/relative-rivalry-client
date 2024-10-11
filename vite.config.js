import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: false, // Disable minification
  },
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    // port: 3000,
  },
})
