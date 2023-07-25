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
    name,
    content,
    location,
    fileType,
    ast=emptyObj,
  } = data

  const parsed = path.parse(location)
  const ext = (data.ext || parsed.ext).replace(/^\./, ``)

  return {
    ext,
    ast,
    content,
    location,
    name: name || parsed.name,
    fileType: fileType || typeMap[ext] || ext,
  } as TExFileModel
}