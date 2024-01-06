import path from 'node:path'
import { defineConfig } from 'tsup'
import { fileURLToPath } from 'node:url'
import { promises as fs } from 'node:fs'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(dirname, `..`)
const outfile = path.join(rootDir, `dist/index.d.ts`)
const entry = path.join(rootDir, `src/types/index.ts`)
const typesfile = path.join(rootDir, `dist/types.ts`)

export default defineConfig(async () => {
  await fs.rm(typesfile, { recursive: true, force: true })
  
  return {
    outfile,
    dts: true,
    name: `types`,
    entry: [entry],
    emitDeclarationOnly: true,
  }
})
