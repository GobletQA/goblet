import path from 'node:path'
import { defineConfig } from 'tsup'
import packcfg from '../package.json'
import { fileURLToPath } from 'node:url'
import { promises as fs } from 'node:fs'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(dirname, `..`)
const outdir = path.join(rootDir, `dist`)
const infile = path.join(rootDir, `src/index.ts`)

export default defineConfig(async () => {
  await fs.rm(outdir, { recursive: true, force: true })
  
  return {
    clean: true,
    name: `latent`,
    sourcemap: true,
    splitting: false,
    entry: [infile],
    outDir: outdir,
    format: [`cjs`],
    esbuildOptions:(options, context) => {
      options.external = [
        ...(options?.external ?? []),
        ...(Object.keys(packcfg.dependencies) ?? []),
        ...(Object.keys(packcfg.devDependencies) ?? []),
      ]
    },
    async onSuccess() {
      console.log(`Module "@gobletqa/latent" built successfully`)
    },
  }
})