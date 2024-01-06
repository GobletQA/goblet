import path from 'node:path'
import { defineConfig } from 'tsup'
import packcfg from '../package.json'
import { fileURLToPath } from 'node:url'
import { promises as fs } from 'node:fs'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(dirname, `..`)
const outdir = path.join(rootDir, `dist`)
const outfile = path.join(rootDir, `dist/index.js`)
const entry = path.join(rootDir, `index.ts`)

export default defineConfig(async () => {
  await fs.rm(outfile, { recursive: true, force: true })
  await fs.rm(`${outfile}.map`, { recursive: true, force: true })

  return {
    sourcemap: true,
    splitting: false,
    outDir: outdir,
    format: [`cjs`],
    name: `screencast`,
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

