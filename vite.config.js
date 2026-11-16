import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 3 trang: landing (/), gọi món tại bàn (/order/?ban=N), quản lý (/admin/)
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        order: 'order/index.html',
        admin: 'admin/index.html',
      },
    },
  },
})
