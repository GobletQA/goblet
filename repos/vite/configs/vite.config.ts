import 'esbuild-register'
import path from 'path'
import { defineConfig } from 'vite'
import mkcert from'vite-plugin-mkcert'
import react from '@vitejs/plugin-react'
import { loadConfig } from './frontend.config'
import tsconfigPaths from 'vite-tsconfig-paths'
import { svgrComponent } from 'vite-plugin-svgr-component'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'

const rootDir = path.join(__dirname, '..')
process.env.PLUGIN_DATA_DIR = path.join(rootDir, `../../certs`)
const isHttps = Boolean(
  process.env.VITE_HTTPS && (process.env.VITE_HTTPS === 'true' || process.env.VITE_HTTPS === '1')
)

export default defineConfig(async () => {

  const { envs, port} = loadConfig()

  return {
    root: rootDir,
    build: {
      // minify: false,
      emptyOutDir: true,
    },
    define: envs,
    server: {
      port,
      https: isHttps,
    },
    optimizeDeps: {
      esbuildOptions: {
        target: 'esnext'
      },
    },
    esbuild: {
      logOverride: { 'this-is-undefined-in-esm': 'silent' }
    },
    plugins: [
      // @ts-ignore
      monacoEditorPlugin.default({
        globalAPI: true,
        languageWorkers: ['editorWorkerService', 'html', 'json', 'typescript']
      }),

      react(),
      isHttps && mkcert(),
      tsconfigPaths(),
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


