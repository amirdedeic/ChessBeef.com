import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    proxy: {
      '/socket.io': {
        target: 'http://localhost:5173', // Change to your actual backend port
        ws: true
      },
      '/api': {
        target: 'http://localhost:5173' // Change to your actual backend port
      }
    }
  }
})