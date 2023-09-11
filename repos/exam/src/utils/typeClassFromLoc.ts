import { TExFileModel } from "@GEX/types"

import path from 'path'
import { findGlobMatch } from "./globMatch"

export type TClassFromLoc<T=any> = {
  type?:string
  found?: T
}

const typeChecks = <T>(
  val:string,
  typeKeys:string[],
  typeMap:Record<string, T>
):{ found?: T, type?:string } => {

  if(!val) return {}
  if(typeMap[val]) return { found: typeMap[val], type: val}

  const found = findGlobMatch(val, typeKeys)

  if(found && typeMap[found]) return { found: typeMap[found], type: found }

  return {}
}

export const typeClassFromLoc = <T>(
  file:TExFileModel,
  typeMap:Record<string, T>
):TClassFromLoc<T> => {

  const { ext, location, fileType } = file
  const typeKeys = Object.keys(typeMap)

  const fileExt = (ext || (location && path.extname(location))).replace(/^\./, ``)

  const extFound = typeChecks(fileExt, typeKeys, typeMap)
  if(extFound.found) return extFound

  const extDotFound = typeChecks(`.${fileExt}`, typeKeys, typeMap)
  if(extDotFound.found) return extDotFound

  const typeFound = typeChecks(fileType, typeKeys, typeMap)
  if(typeFound.found) return typeFound

  const locFound = typeChecks(location, typeKeys, typeMap)
  if(locFound.found) return locFound

  const name = path.basename(location, fileExt)
  const nameFound = typeChecks(name, typeKeys, typeMap)
  if(nameFound.found) return nameFound

  return undefined

}
