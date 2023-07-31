import { TExFileModel } from "@GEX/types"
import { FileTypeMap } from "@GEX/constants/constants"
import path from 'path'

export const findFileType = (
  file:TExFileModel,
  extMap:Record<string, string>
) => {
  const { ext, fileType } = file

  const typeMap = { ...FileTypeMap, ...extMap }
  
  if(fileType && typeMap[fileType]) return typeMap[fileType]

  const fileExt = ext || path.extname(file.location).replace(/^\./, ``)
  if(fileExt && typeMap[fileExt]) return typeMap[fileType]

  const last = file.location.split(`/`).pop().trim()

  return typeMap[last]
}

    // const fileExt = file.ext || path.extname(file.location).replace(/^\./, ``)
    // const override = opts.override
    //   || this.baseTransformExt.includes(fileExt) && fallback
    //   || typeClassFromLoc<IExTransform>(file, this.transformTypes)