import path from 'node:path'
import { defineConfig } from 'tsup'
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
    experimentalDts: true,
    format: [`cjs`, `esm`],
    async onSuccess() {
      await fs.rm(path.join(logOutdir, `Users`), { recursive: true, force: true })
      console.log(`Module "@gobletqa/logger" built successfully`)
    },
  }
})