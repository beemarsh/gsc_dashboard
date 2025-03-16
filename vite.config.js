import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // server: {
  //   host: 'api.gulfsouth.info',
  //   port: 5173,
  //   cors: true,
  //   headers: {
  //     'Access-Control-Allow-Origin': '*'
  //   },
  //   allowedHosts: [
  //     'gulfsouth.info',
  //     'www.gulfsouth.info'
  //   ]
  // }
})
