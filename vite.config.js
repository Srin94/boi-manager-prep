import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// For GitHub Pages the app is served from https://<user>.github.io/<repo>/,
// so production builds need a matching base path. Local dev stays at '/'.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/boi-manager-prep/' : '/',
  server: { port: 5173, open: true },
}))
