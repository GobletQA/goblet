import path from 'node:path'

import { fileURLToPath } from 'node:url'
import { promises as fs } from 'node:fs'
import { ife } from '@keg-hub/jsutils'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(dirname, `..`)
const decfile = path.join(rootDir, `dist/index.d.ts`)
const outfile = path.join(rootDir, `dist/types.ts`)

const importWarn = `// @ts-nocheck
/*
 * This file is auto-generated, and not intended for general use.
 * It should only used for the \`root/tasks/definitions\` and **NOTHING ELSE**
 * **DO NOT** \`import\` it into a repo. You have been warned!
 */
\n`

ife(async () => {
  const content = await fs.readFile(decfile, `utf-8`)
  const replaced = `${importWarn}${content.replaceAll(`import `, `import type `)}`
  await fs.writeFile(outfile, replaced)
  await fs.rm(decfile, { recursive: true, force: true })
})

