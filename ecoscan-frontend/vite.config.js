import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl()],
  server: {
    proxy: {
      '/scan': 'http://127.0.0.1:8000',
      '/speak': 'http://127.0.0.1:8000',
      '/market-data': 'http://127.0.0.1:8000',
    }
  }
})
