import path from 'node:path'
import { defineConfig } from 'tsup'
import { fileURLToPath } from 'node:url'
import { promises as fs } from 'node:fs'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(dirname, `..`)
const constOutdir = path.join(rootDir, `dist/constants`)
const constIn = path.join(rootDir, `src/constants/index.ts`)

export default defineConfig(async () => {
  await fs.rm(constOutdir, { recursive: true, force: true })
  
  return {
    clean: true,
    splitting: false,
    sourcemap: true,
    outDir: constOutdir,
    experimentalDts: true,
    format: [`cjs`, `esm`],
    entry: [
      constIn,
    ],
    async onSuccess() {
      console.log(`Module "@gobletqa/environment/constants" built successfully`)
    },
  }
})