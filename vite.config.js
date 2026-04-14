import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/-maritime-medic/',
  resolve: {
    preserveSymlinks: true,
  },
  server: {
    port: 5174,
    fs: {
      allow: ['..'],
    },
  },
})
