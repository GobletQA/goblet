import 'esbuild-register'
import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { comlink } from 'vite-plugin-comlink'
import { loadConfig } from './frontend.config'
import tsconfigPaths from 'vite-tsconfig-paths'
import { svgrComponent } from 'vite-plugin-svgr-component'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'

const rootDir = path.join(__dirname, '..')

export default defineConfig(async () => {

  const { aliases, envs, port } = loadConfig()

  return {
    root: rootDir,
    build: {
      minify: false,
      emptyOutDir: true,
    },
    define: envs,
    server: {
      port,
    },
    optimizeDeps: {
      esbuildOptions: {
        target: 'esnext'
      },
    },
    esbuild: {
      logOverride: { 'this-is-undefined-in-esm': 'silent' }
    },
    resolve:{
      alias: aliases,
    },
    plugins: [
      comlink(),
      // @ts-ignore
      monacoEditorPlugin.default({
        globalAPI: true,
        languageWorkers: ['editorWorkerService', 'html', 'json', 'typescript']
      }),

      react(),
      tsconfigPaths(),
      svgrComponent({
        svgrOptions: {
          ref: true,
          icon: true,
          expandProps: true,
          dimensions: false
        }
      }),
    ],
    worker: {
      plugins: [
        comlink()
      ]
    }
  }

})


