import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // This allows the frontend to talk to the backend easier if you use proxy
    // but for now we are using CORS on the backend, so this is optional.
  }
})