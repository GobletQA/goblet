import type { TExFileModel } from '@GEX/types'

import path from 'path'
import {emptyObj} from '@keg-hub/jsutils'
import {FileTypeMap} from '@GEX/constants/constants'

export type TToFileModel = Omit<Partial<TExFileModel>, `content`|`location`> & {
  content:string
  location:string
}

export const toFileModel = (data:TToFileModel, typeMap:Record<string, string>=FileTypeMap) => {
  const {
    ext,
    name,
    content,
    location,
    fileType,
    ast=emptyObj,
  } = data

  const pExt = path.extname(location)

  return {
    ast,
    content,
    location,
    ext: ext || pExt.replace('.', ''),
    fileType: fileType || typeMap[ext] || ext,
    name: name || path.basename(location, pExt),
  } as TExFileModel
}