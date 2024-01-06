import path from 'node:path'
import { defineConfig } from 'tsup'
import packcfg from '../package.json'
import { fileURLToPath } from 'node:url'
import { promises as fs } from 'node:fs'
import { getEntries } from '../scripts/getEntries'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(dirname, `..`)
const outdir = path.join(rootDir, `dist/steps`)
const stepsDir = path.join(rootDir, `src/steps`)


export default defineConfig(async () => {
  await fs.rm(outdir, { recursive: true, force: true })

  const entries = await getEntries({
    cwd: stepsDir,
    ignore: [
      `**/jest/**`,
      `**/waypoint/**`,
      `**/__tests__/**`,
      `**/__mocks__/**`,
    ]
  })

  return {
    sourcemap: true,
    splitting: true,
    outDir: outdir,
    entry: entries,
    format: [`cjs`],
    name: `testify/steps`,
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

