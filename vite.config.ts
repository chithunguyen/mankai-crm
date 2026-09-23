import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' + HashRouter: chạy được trên GitHub Pages ở bất kỳ tên repo nào.
export default defineConfig({
  base: './',
  plugins: [react()],
})
