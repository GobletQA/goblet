import path from 'node:path'
import { defineConfig } from 'tsup'
import packcfg from '../package.json'
import { fileURLToPath } from 'node:url'
import { promises as fs } from 'node:fs'
const dirname = path.dirname(fileURLToPath(import.meta.url))

const rootDir = path.join(dirname, `..`)
const outdir = path.join(rootDir, `dist`)
const outauto = path.join(rootDir, `dist/auto.js`)
const outwatch = path.join(rootDir, `dist/watch.js`)

const auto = path.join(rootDir, `src/auto.ts`)
const watch = path.join(rootDir, `src/watch.ts`)

export default defineConfig(async () => {

  await fs.rm(outwatch, { recursive: true, force: true })
  await fs.rm(`${outwatch}.map`, { recursive: true, force: true })

  await fs.rm(outauto, { recursive: true, force: true })
  await fs.rm(`${outauto}.map`, { recursive: true, force: true })

  return {
    name: `auto`,
    sourcemap: true,
    splitting: false,
    entry: [watch, auto],
    outDir: outdir,
    format: [`cjs`],
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
      console.log(`Module "@gobletqa/git/auto" built successfully`)
    },
  }
})
