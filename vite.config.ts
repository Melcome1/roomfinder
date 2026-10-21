import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'RoomFinder',
        short_name: 'RoomFinder',
        theme_color: '#0f1226',
        background_color: '#0f1226',
        display: 'standalone',
        icons: []
      }
    })
  ],
  server: { host: true, port: 5173 }
})