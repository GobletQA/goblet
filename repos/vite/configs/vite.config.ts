import 'esbuild-register'
import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { comlink } from 'vite-plugin-comlink'
import { loadConfig } from './frontend.config'
import tsconfigPaths from 'vite-tsconfig-paths'
import { svgrComponent } from 'vite-plugin-svgr-component'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'
// @ts-ignore
const monacoEditor = monacoEditorPlugin.default
const rootDir = path.join(__dirname, '..')

export default defineConfig(async () => {

  const { aliases, environment, envs, port } = loadConfig()

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
        target: `esnext`,
        jsx: `automatic`,
        jsxDev: environment !== `production`,
      },
      entries: [
        `hoist-non-react-statics`,
      ]
    },
    esbuild: {
      logOverride: {
        [`this-is-undefined-in-esm`]: `silent`
      }
    },
    resolve:{
      alias: aliases,
    },
    plugins: [
      react(),
      comlink(),
      monacoEditor({
        globalAPI: true,
        languageWorkers: [
          `html`,
          `json`,
          `typescript`,
          `editorWorkerService`,
        ]
      }),
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


