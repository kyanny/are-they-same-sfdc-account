import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/are-they-same-sfdc-account/',
  plugins: [vue()],
  server: {
    port: 3000,
    open: true
  }
})
