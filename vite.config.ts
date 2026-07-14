import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
  build: {
    // Raise warning threshold — Firebase + Supabase SDKs are intentionally large
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        // Split vendor libraries into separate chunks for better caching
        manualChunks: {
          'firebase':  ['firebase/app', 'firebase/auth'],
          'supabase':  ['@supabase/supabase-js'],
          'react':     ['react', 'react-dom'],
        }
      }
    }
  }
})
