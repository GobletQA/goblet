import path from 'node:path'
import { defineConfig } from 'tsup'
import packcfg from '../package.json'
import { fileURLToPath } from 'node:url'
import { promises as fs } from 'node:fs'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(dirname, `..`)
const outdir = path.join(rootDir, `dist`)
const outfile = path.join(rootDir, `dist/api.js`)
const entry = path.join(rootDir, `src/api.ts`)

export default defineConfig(async () => {
  await fs.rm(outfile, { recursive: true, force: true })
  await fs.rm(`${outfile}.map`, { recursive: true, force: true })

  return {
    name: `api`,
    sourcemap: true,
    splitting: true,
    outDir: outdir,
    format: [`cjs`],
    entry: [entry],
    esbuildOptions:(options, context) => {
      options && (
        options.external = [
          ...(Object.keys(packcfg.dependencies || {})),
          ...(Object.keys(packcfg.devDependencies || {})),
        ]
      )
    }
  }
})

