import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        maximumFileSizeToCacheInBytes: 5000000
      },

      manifest: {
        name: 'HiOSMobile',
        short_name: 'HiOSMobile',
        description: 'The main app by The Highland Cafe(tm)',
        theme_color: '#111318',
        background_color: '#111318',
        display: 'standalone',
        start_url: '/app/',
        icons: [
          {
            src: '/app/hiosbadge.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/app/hiosbadge.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/app/hiosbadge.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  base: "/app/",
  build: {
    cssMinify: false,
  },
});
