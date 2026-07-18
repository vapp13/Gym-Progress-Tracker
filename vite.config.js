import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Fitness App',
        short_name: 'Fitness',
        description: 'Track workouts, goals, and progress.',
        theme_color: '#121212',
        background_color: '#121212',
        display: 'standalone',
        start_url: '/Gym-Progress-Tracker/#/',
        scope: '/Gym-Progress-Tracker/',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      },
    }),
  ],
  base: '/Gym-Progress-Tracker/',
})