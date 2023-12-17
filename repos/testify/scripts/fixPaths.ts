/**
 * Helper script to replace path.resolve imports from .ts to .js for code bundled by esbuild 
 */

import path from 'path'
import { globSync } from "glob"
import { fileURLToPath } from 'url'
import { readFileSync, writeFileSync } from 'fs'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(dirname, `..`)
const builddir = path.join(rootDir, `build`)

;(async () => {
  const resolveRegEx = /(resolve\(.*['|"].*\.)(ts)(['|"]\))/g
  const files = globSync(path.join(builddir, `**/*.{js,ts}`))
  const flen = files.length
  let count = 0

  for (let i = 0; i < flen; i += 1) {
    const file = files[i]
    const text = readFileSync(file, 'utf8')
    const newText = resolveRegEx.test(text)
      ? text.replaceAll(resolveRegEx, `$1js$3`)
      : text

    if (text !== newText) {
      writeFileSync(file, newText, 'utf8')
      console.log(`Fixed ".ts" imports in "${file.replace(rootDir, ``)}"`)
      count = count + 1
    }
  }
})()
