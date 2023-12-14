import path from 'node:path'
import { defineConfig } from 'tsup'
import packcfg from '../package.json'
import { fileURLToPath } from 'node:url'
import { promises as fs } from 'node:fs'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(dirname, `..`)
const logOutdir = path.join(rootDir, `dist/log`)
const logIn = path.join(rootDir, `src/index.ts`)

export default defineConfig(async () => {
  await fs.rm(logOutdir, { recursive: true, force: true })
  
  return {
    clean: true,
    sourcemap: true,
    splitting: false,
    entry: [logIn],
    outDir: logOutdir,
    format: [`cjs`],
    esbuildOptions:(options, context) => {
      options.external = [
        ...(options?.external ?? []),
        ...(Object.keys(packcfg.dependencies) ?? []),
        ...(Object.keys(packcfg.devDependencies) ?? []),
      ]
    },
    async onSuccess() {
      console.log(`Module "@gobletqa/logger" built successfully`)
    },
  }
})