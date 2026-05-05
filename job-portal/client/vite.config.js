import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,      
    strictPort: false, // 👈 Ise false rakhein taaki agar 5173 busy ho toh Vite crash na ho
    host: true,        // 👈 Isse aap apne mobile par bhi preview dekh sakte hain
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  // 👇 YE SABSE ZAROORI HAI: React-to-print ke error ko fix karne ke liye
  optimizeDeps: {
    include: ['react-to-print'],
  },
})