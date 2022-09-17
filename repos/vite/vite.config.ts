import path from 'path'
import { defineConfig } from 'vite'
import mkcert from'vite-plugin-mkcert'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { resolve } from 'path'

process.env.PLUGIN_DATA_DIR = path.join(__dirname, `../../certs`)

const pathResolve = (dir: string) => resolve(__dirname, '.', dir)

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: true
  },
  plugins: [tsconfigPaths(), react(), mkcert()]
})
