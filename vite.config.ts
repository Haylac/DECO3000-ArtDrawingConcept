import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'      // <-- Babel-based
import { cloudflare } from '@cloudflare/vite-plugin'

export default defineConfig({
  plugins: [
    cloudflare(), 
    react(),      // use Babel-based plugin instead of SWC
  ],
})