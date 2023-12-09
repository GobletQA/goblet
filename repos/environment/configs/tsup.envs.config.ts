import path from 'node:path'
import { defineConfig } from 'tsup'
import { fileURLToPath } from 'node:url'
import { promises as fs } from 'node:fs'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(dirname, `..`)
const envsOutdir = path.join(rootDir, `dist/envs`)
const envsIn = path.join(rootDir, `src/index.ts`)

export default defineConfig(async () => {
  await fs.rm(envsOutdir, { recursive: true, force: true })
  
  return {
    clean: true,
    sourcemap: true,
    splitting: false,
    entry: [envsIn],
    outDir: envsOutdir,
    experimentalDts: true,
    format: [`cjs`, `esm`],
    async onSuccess() {
      await fs.rm(path.join(envsOutdir, `Users`), { recursive: true, force: true })
      console.log(`Module "@gobletqa/environment" built successfully`)
      
    },
  }
})