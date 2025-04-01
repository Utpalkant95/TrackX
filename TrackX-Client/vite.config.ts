import { defineConfig } from 'vite'
import path from "path"
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["7cf0-2409-40d0-1035-72-6c67-453-4a9a-f325.ngrok-free.app"]
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
