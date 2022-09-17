import path from 'path'
import { defineConfig } from 'vite'
import mkcert from'vite-plugin-mkcert'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { svgrComponent } from 'vite-plugin-svgr-component';

process.env.PLUGIN_DATA_DIR = path.join(__dirname, `../../certs`)

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: true
  },
  plugins: [
    tsconfigPaths(),
    react(),
    mkcert(),
    svgrComponent({
      svgrOptions: {
        ref: true,
        icon: true,
        expandProps: true,
        dimensions: false
      }
    }),
  ]
})
