import type { TExFileModel } from '@GEX/types'

import path from 'path'
import Module from 'module'
import { requireFromString as reqFromStr } from 'module-from-string'

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 * because the buffer-to-string conversion in `fs.readFileSync()`
 * translates it to FEFF, the UTF-16 BOM.
 * NOTE: Taken from node module.js (line 464) and used as in node modules.js (line 478)
 */
const stripBOM = (content:string) => {
  return content.charCodeAt(0) === 0xFEFF
    ? content.slice(1)
    : content
}

/**
* Takes a FileModel and converts it into a Module loading it's content as Javascript
*/
export const requireFromString = (model:TExFileModel, content?:string) => {
  const {
    name,
    location,
  } = model

  const mod = new Module(location)
  mod.filename = name

  // @ts-ignore
  mod.paths = Module._nodeModulePaths(path.dirname(name))
  // @ts-ignore
  mod._compile(stripBOM(content || model.content), name)

  return mod.exports
}

/**
* Takes a FileModel and converts it into a Module loading it's content as Javascript
* Uses the VM module to require the module in a separate context
*/
export const requireFromStringVM = (model:TExFileModel, content?:string) => {
  const {
    name,
    location,
  } = model

  return reqFromStr(stripBOM(content || model.content), {
    filename: name,
    useCurrentGlobal: true,
    dirname: path.dirname(location),
  })

}
