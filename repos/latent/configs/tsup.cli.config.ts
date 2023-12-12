import path from 'node:path'
import { defineConfig } from 'tsup'
import { fileURLToPath } from 'node:url'
import { promises as fs } from 'node:fs'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(dirname, `..`)
const outdir = path.join(rootDir, `.bin`)
const infile = path.join(rootDir, `src/bin/index.ts`)

export default defineConfig(async () => {
  await fs.rm(outdir, { recursive: true, force: true })
  
  return {
    dts: true,
    clean: true,
    bundle: true,
    name: `latent`,
    outDir: outdir,
    sourcemap: true,
    splitting: false,
    entry: [infile],
    external: [`esbuild`],
    format: [`cjs`, `esm`],
    async onSuccess() {
      // await fs.rm(path.join(outdir, `Users`), { recursive: true, force: true })
      console.log(`Module "@gobletqa/latent/cli" built successfully`)
    },
  }
})