import path from 'node:path'
import { defineConfig } from 'tsup'
import packcfg from '../package.json'
import { fileURLToPath } from 'node:url'
import { promises as fs } from 'node:fs'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(dirname, `..`)
const binDir = path.join(rootDir, `src/bin`)
const cliOutdir = path.join(rootDir, `.bin`)
const cliIn = path.join(rootDir, `src/bin/index.ts`)

const workerEntry = path.join(binDir, `worker.ts`)
const workerPipeline = path.join(binDir, `workerPipeline.ts`)

export default defineConfig(async () => {
  await fs.rm(cliOutdir, { recursive: true, force: true })
  
  return {
    clean: true,
    name: `exam/cli`,
    dtsResolve: true,
    splitting: false,
    sourcemap: true,
    outDir: cliOutdir,
    format: [`cjs`],
    entry: [
      cliIn,
      workerEntry,
      workerPipeline
    ],
    esbuildOptions:(options, context) => {
      options.external = [
        ...(options?.external ?? []),
        ...(Object.keys(packcfg.dependencies) ?? []),
        ...(Object.keys(packcfg.devDependencies) ?? []),
      ]
    },
    async onSuccess() {
      console.log(`Module "@gobletqa/exam/cli" built successfully`)
    },
  }
})