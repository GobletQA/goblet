import { TFileModel } from '../types'

import { isObj } from '@keg-hub/jsutils/isObj'
import { fileModel } from '../models/fileModel'

export const fileFactory = (
  file:string|Partial<TFileModel>,
  content?:string,
  relative?:string
):TFileModel => {

  const built = isObj<TFileModel>(file)
    ? {
        ...file,
        location: file.location || ``,
        content: content || file.content || ``,
        relative: relative || file.relative || file.location || ``,
      } as TFileModel
    : {
        content,
        location: file,
        relative: relative || file,
      } as TFileModel

  const { location, relative:name } = built

  return fileModel({
    ast: {},
    uuid: location,
    lastModified: 0,
    fileType: `file`,
    mime: `text/plain`,
    ext: location.includes(`.`) ? location.split('.').pop() : ``,
    name: location.includes(`/`) ? location.split(`/`).pop() : name,
    ...built
  })
}