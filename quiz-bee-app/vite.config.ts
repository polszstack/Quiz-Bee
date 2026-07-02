import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/Quiz-Bee/', // Your repo name - make sure this matches exactly
  plugins: [
    vue(),
    tailwindcss(),
  ],
})