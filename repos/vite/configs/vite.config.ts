import 'esbuild-register'
import path from 'path'
import { defineConfig } from 'vite'
import million from 'million/compiler'
import react from '@vitejs/plugin-react-swc'
import { comlink } from 'vite-plugin-comlink'
import { loadConfig } from './frontend.config'
import tsconfigPaths from 'vite-tsconfig-paths'
import { svgrComponent } from 'vite-plugin-svgr-component'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'
// @ts-ignore
const monacoEditor = monacoEditorPlugin.default
const rootDir = path.join(__dirname, '..')
const gobletRoot = path.join(rootDir, `../..`)

// @ts-ignore
export default defineConfig(async () => {
  const { aliases, environment, envs, port } = await loadConfig()

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
      force: true,
      includes: [
        `@gobletqa/components`,
        `@gobletqa/configs`,
        `@gobletqa/shared`,
        `@gobletqa/race`,
        `@gobletqa/monaco`,
        `@mui/material`,
        `@mui/icons-material`,
        `@ltipton/parkin`,
        `@keg-hub/jsutils`,
        `@emotion/react`,
        `@emotion/styled`,
        `monaco-editor`,
        `monaco-textmate`,
        `onigasm`,
      ],
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
      alias: {
        ...aliases,
        [`@keg-hub/jsutils`]: path.join(gobletRoot, `node_modules/@keg-hub/jsutils/build/esm`),
      },
    },
    plugins: [
      million.vite({ auto: true, mute: true }),
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
      plugins: () => [comlink()]
    }
  }

})


