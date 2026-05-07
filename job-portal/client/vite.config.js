import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 1. Port fix karne ke liye:
    port: 5173,      
    strictPort: true, // 👈 Ise TRUE karein taaki port change na ho. Agar 5173 busy hoga toh ye bata dega.
    
    // 2. Network access ke liye:
    host: true,       
    
    // 3. Proxy settings (Local testing ke liye):
    proxy: {
      '/api': {
        // Yahan wo port dalein jo aapke backend index.js mein hai (8001 ya 5000)
        target: 'http://localhost:8001', 
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // 4. Dependency optimization (Resume builder ke liye):
  optimizeDeps: {
    include: ['react-to-print'],
  },

  // 5. Build settings:
  build: {
    outDir: 'dist', // Render isi folder ko dhundta hai
  }
})