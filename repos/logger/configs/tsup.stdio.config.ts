import path from 'node:path'
import { defineConfig } from 'tsup'
import packcfg from '../package.json'
import { fileURLToPath } from 'node:url'
import { promises as fs } from 'node:fs'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(dirname, `..`)
const stdioOutdir = path.join(rootDir, `dist/stdio`)
const stdioIn = path.join(rootDir, `src/stdio.ts`)

export default defineConfig(async () => {
  await fs.rm(stdioOutdir, { recursive: true, force: true })
  
  return {
    clean: true,
    sourcemap: true,
    splitting: false,
    entry: [stdioIn],
    outDir: stdioOutdir,
    format: [`cjs`],
    esbuildOptions:(options, context) => {
      options.external = [
        ...(options?.external ?? []),
        ...(Object.keys(packcfg.dependencies) ?? []),
        ...(Object.keys(packcfg.devDependencies) ?? []),
      ]
    },
    async onSuccess() {
      console.log(`Module "@gobletqa/logger/stdio" built successfully`)
    },
  }
})
