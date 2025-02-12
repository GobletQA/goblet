import path from 'node:path'
import { defineConfig } from 'tsup'
import packcfg from '../package.json'
import { fileURLToPath } from 'node:url'
import { promises as fs } from 'node:fs'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(dirname, `..`)
const outdir = path.join(rootDir, `dist/envs`)
const entry = path.join(rootDir, `src/index.ts`)


export default defineConfig(async () => {
  await fs.rm(outdir, { recursive: true, force: true })
  
  return {
    clean: true,
    entry: [entry],
    outDir: outdir,
    format: [`cjs`],
    sourcemap: true,
    splitting: false,
    name: `environment`,
    esbuildOptions:(options, context) => {
      options && (
        options.external = [
          ...(options?.external ?? []),
          ...(Object.keys(packcfg.dependencies) ?? []),
          ...(Object.keys(packcfg.devDependencies) ?? []),
        ]
      )
    },
    async onSuccess() {
      console.log(`Module "@gobletqa/environment" built successfully`)
    },
  }
})
