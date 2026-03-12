import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'

import packageJson from './package.json'

const proxyTarget = 'http://localhost:8001/'
export default defineConfig({
  plugins: [react(), checker({ typescript: true })],
  resolve: {
    alias: {
      assets: path.resolve(__dirname, './src/assets'),
      Common: path.resolve(__dirname, './src/Common'),
      controllers: path.resolve(__dirname, './src/controllers'),
      Features: path.resolve(__dirname, './src/Features'),
      localesResources: path.resolve(__dirname, './src/localesResources'),
      main: path.resolve(__dirname, './src/main'),
      services: path.resolve(__dirname, './src/services'),
      store: path.resolve(__dirname, './src/store'),
      router: path.resolve(__dirname, './src/router'),
      utils: path.resolve(__dirname, './src/utils'),
      tests: path.resolve(__dirname, './src/tests'),
    },
  },
  // Optional: Silence Sass deprecation warnings. See note below.
  css: {
    transformer: 'lightningcss',
  },
  define: {
    'import.meta.env.VITE__BUILD_YEAR__': JSON.stringify(
      new Date().getFullYear()
    ),
    'import.meta.env.VITE__BUILD_DATE__': JSON.stringify(
      new Date().toISOString()
    ),
    'import.meta.env.VITE_APP_NAME': JSON.stringify(packageJson.name),
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(packageJson.version),
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/SitradWebService': {
        target: proxyTarget,
        changeOrigin: true,
        secure: false,
      },
      '/SitradWebSupportService': {
        target: proxyTarget,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    sourcemap: false,
    outDir: 'build',
  },
})
