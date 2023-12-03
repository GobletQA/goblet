import path from 'node:path'
import { defineConfig } from 'tsup'
import { fileURLToPath } from 'node:url'
import { promises as fs } from 'node:fs'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(dirname, `..`)
const outdir = path.join(rootDir, `dist`)
const envsOutdir = path.join(rootDir, `dist/envs`)
const constOutdir = path.join(rootDir, `dist/constants`)
const envsIn = path.join(rootDir, `src/index.ts`)
const constIn = path.join(rootDir, `src/constants/index.ts`)

export default defineConfig(async () => {
  await fs.rm(outdir, { recursive: true, force: true })
  
  return {
    // dts: true,
    clean: true,
    splitting: false,
    sourcemap: true,
    outDir: envsOutdir,
    format: [`cjs`, `esm`],
    entry: [
      envsIn,
      constIn,
    ],
    async onSuccess() {
      await fs.rename(path.join(envsOutdir, `constants`), constOutdir)
    },
  }
})