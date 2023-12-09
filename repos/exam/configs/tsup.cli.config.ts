import path from 'node:path'
import { defineConfig } from 'tsup'
import { fileURLToPath } from 'node:url'
import { promises as fs } from 'node:fs'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(dirname, `..`)
const binDir = path.join(rootDir, `src/bin`)
const cliOutdir = path.join(rootDir, `dist/cli`)
const cliIn = path.join(rootDir, `src/bin/index.ts`)

const workerEntry = path.join(binDir, `worker.ts`)
const workerPipeline = path.join(binDir, `workerPipeline.ts`)


export default defineConfig(async () => {
  await fs.rm(cliOutdir, { recursive: true, force: true })
  
  return {
    dts:true,
    clean: true,
    dtsResolve: true,
    splitting: false,
    sourcemap: true,
    outDir: cliOutdir,
    format: [`cjs`, `esm`],
    entry: [
      cliIn,
      workerEntry,
      workerPipeline
    ],
    async onSuccess() {
      await fs.rm(path.join(cliOutdir, `Users`), { recursive: true, force: true })
      console.log(`Module "@gobletqa/exam/cli" built successfully`)
    },
  }
})