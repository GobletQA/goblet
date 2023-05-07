import type { TFileTree, TFileModel } from '@types'

import { useCallback } from 'react'
import { emptyObj } from '@keg-hub/jsutils'
import { saveFile } from '@actions/files/api/saveFile'
import { addRootToLoc } from '@utils/repo/addRootToLoc'

export const useOnSaveFile = (
  files:TFileTree,
  rootPrefix:string
) => {
  return useCallback(async (
    loc:string,
    content:string|null,
    ext:Partial<TFileModel>= emptyObj as Partial<TFileModel>
  ) => {
    if(content === null)
      return console.warn(`[File Save Error]: Can not save file with null content`)

    if(!loc)
      return console.warn(`[File Save Error]: Can not save file, missing file location`)

    const fullLoc = addRootToLoc(loc, rootPrefix)
    const fileModel = files[fullLoc]

    const hasInlineModel = Boolean(ext.location && ext.content && ext.fileType)

    if(!fileModel && !hasInlineModel)
      return console.warn(`[File Save Error]: Can not save file. Missing file model at ${fullLoc}`)

    await saveFile({
      ...(fileModel as TFileModel),
      ...ext,
      content
    })

  }, [files, rootPrefix])
}
