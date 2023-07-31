import {
  TExFileModel,
  TExArrClsOptMap,
} from "@GEX/types"

import path from 'path'
import { findGlobMatch } from "./globMatch"


export type TTypeFromFileMap<T=any> = {
  [Key:string]: TExArrClsOptMap<T>
}

const typeChecks = <T>(
  val:string,
  typeKeys:string[],
  typeMap:TTypeFromFileMap<T>
):TExArrClsOptMap<T> => {

  if(!val) return undefined
  if(typeMap[val]) return typeMap[val]

  const found = findGlobMatch(val, typeKeys)

  if(found && typeMap[found]) return typeMap[found]

  return undefined
}

export const typeClassFromLoc = <T>(
  file:TExFileModel,
  typeMap:TTypeFromFileMap<T>
):TExArrClsOptMap<T> => {

  const { ext, location, fileType } = file
  const typeKeys = Object.keys(typeMap)

  const fileExt = (ext || (location && path.extname(location))).replace(/^\./, ``)

  const extFound = typeChecks(fileExt, typeKeys, typeMap)
  if(extFound) return extFound

  const extDotFound = typeChecks(`.${fileExt}`, typeKeys, typeMap)
  if(extDotFound) return extDotFound

  const typeFound = typeChecks(fileType, typeKeys, typeMap)
  if(typeFound) return typeFound

  const locFound = typeChecks(location, typeKeys, typeMap)
  if(locFound) return locFound

  const name = path.basename(location, fileExt)
  const nameFound = typeChecks(name, typeKeys, typeMap)
  if(nameFound) return nameFound


  return undefined

}
