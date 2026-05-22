import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/pink-kit-co/',  // ← GitHub repo name daalo
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})