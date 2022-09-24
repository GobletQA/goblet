import path from 'path'
import { defineConfig, searchForWorkspaceRoot } from 'vite'
import mkcert from'vite-plugin-mkcert'
import react from '@vitejs/plugin-react'
import { loadConfig } from './frontend.config'
import tsconfigPaths from 'vite-tsconfig-paths'
import EnvironmentPlugin from 'vite-plugin-environment'
import { svgrComponent } from 'vite-plugin-svgr-component'

const rootDir = path.join(__dirname, '..')
process.env.PLUGIN_DATA_DIR = path.join(rootDir, `../../certs`)

// @ts-ignore
export default defineConfig(async () => {
  const { envs, port} = loadConfig()

  return {
    root: rootDir,
    server: {
      port,
      https: true,
    },
    plugins: [
      react(),
      mkcert(),
      tsconfigPaths(),
      EnvironmentPlugin(envs),
      svgrComponent({
        svgrOptions: {
          ref: true,
          icon: true,
          expandProps: true,
          dimensions: false
        }
      }),
    ]
  }

})


