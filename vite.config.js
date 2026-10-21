import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // dev/preview only: let ngrok tunnels through
  server: { allowedHosts: ['.ngrok-free.app', '.ngrok-free.dev', '.ngrok.app'] },
  preview: { allowedHosts: ['.ngrok-free.app', '.ngrok-free.dev', '.ngrok.app'] },
})
