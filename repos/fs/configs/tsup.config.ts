import path from 'node:path'
import { defineConfig } from 'tsup'
import { fileURLToPath } from 'node:url'
import { promises as fs } from 'node:fs'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(dirname, `..`)
const outdir = path.join(rootDir, `dist`)
const fsin = path.join(rootDir, `src/index.ts`)

export default defineConfig(async () => {
  await fs.rm(outdir, { recursive: true, force: true })
  
  return {
    dts: true,
    name: `fs`,
    clean: true,
    sourcemap: true,
    splitting: false,
    entry: [fsin],
    outDir: outdir,
    format: [`cjs`, `esm`],
    async onSuccess() {
      console.log(`Module "@gobletqa/fs" built successfully`)
    },
  }
})
