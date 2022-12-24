import 'esbuild-register'
import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { svgrComponent } from 'vite-plugin-svgr-component'

const rootDir = path.join(__dirname, '..')

export default defineConfig(async () => {
  return {
    root: rootDir,
    build: {
      minify: false,
      emptyOutDir: true,
      lib: {
        entry: path.resolve(__dirname, '../src/index.ts'),
        name: 'RaceEditor',
        fileName: 'raceEditor',
      },
      rollupOptions: {
        external: ['react', 'react-dom'],
        output: {
          globals: {
            react: 'react',
            'react-dom': 'ReactDOM',
          },
        },
      },
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
    ]
  }

})


