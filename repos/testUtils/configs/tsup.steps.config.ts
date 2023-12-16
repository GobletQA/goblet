import path from 'node:path'
import { defineConfig } from 'tsup'
import packcfg from '../package.json'
import { fileURLToPath } from 'node:url'
import { promises as fs } from 'node:fs'
import { getEntries } from '../scripts/getEntries'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(dirname, `..`)
const outdir = path.join(rootDir, `dist`)
import { inspect } from 'util'


export default defineConfig(async () => {
  await fs.rm(outdir, { recursive: true, force: true })

  const entries = await getEntries({
    ignore: [
      `**/steps/**`,
      `**/jest/**`,
      `**/waypoint/**`,
    ]
  })

  return {
    sourcemap: true,
    splitting: true,
    outDir: outdir,
    entry: entries,
    format: [`cjs`],
    name: `test-utils`,
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

