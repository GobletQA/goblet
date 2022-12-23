import path from 'path'
import { fileURLToPath } from 'url'
import { registerAliases } from '../../configs/aliases.config'

registerAliases()

let fileLoc:string
// @ts-ignore
try { fileLoc = fileURLToPath(import.meta.url)}
catch(err){ fileLoc =__filename}

const fileDir = path.dirname(fileLoc)
const dirname = fileDir.endsWith(`/dist`) ? path.dirname(fileDir) : fileDir

/**
 * Will be needed when the package is bundled
 * Still needs to be figured out
 * So for now just return __dirname
 */
const resolveRoot = () => (dirname)

export const GBERoot = resolveRoot()