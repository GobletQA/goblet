import { register } from 'esbuild-register/dist/node'
register()

import path from 'node:path'
import { defineConfig } from 'tsup'
import { fileURLToPath } from 'node:url'
import { promises as fs } from 'node:fs'
const dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(dirname, `..`)
const examOutdir = path.join(rootDir, `dist/exam`)
const examIn = path.join(rootDir, `src/index.ts`)

export default defineConfig(async () => {
  await fs.rm(examOutdir, { recursive: true, force: true })
  
  return {
    dts:true,
    clean: true,
    sourcemap: true,
    splitting: false,
    entry: [examIn],
    outDir: examOutdir,
    format: [`cjs`, `esm`],
    async onSuccess() {
      await fs.rm(path.join(examOutdir, `Users`), { recursive: true, force: true })
      console.log(`Module "@gobletqa/exam" built successfully`)
    },
  }
})