import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/PlanAware/',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        demo: './index-demo.html',
      },
    },
  },
})