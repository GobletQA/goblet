import type { TFileModel, TFilesState } from '@types'

import { useCallback } from 'react'
import { saveFile } from '@actions/files/api/saveFile'
import { addRootToLoc } from '@utils/repo/addRootToLoc'

export const useOnSaveFile = (repoFiles:TFilesState, rootPrefix:string) => {
  return useCallback(async (loc:string, content:string|null) => {
    if(content === null)
      return console.warn(`Can not save file with null content`)

    if(!loc)
      return console.warn(`Can not save file, missing file location`)

    const fullLoc = addRootToLoc(loc, rootPrefix)
    const fileModel = repoFiles?.files[fullLoc]

    if(!fileModel)
      return console.warn(`Can not save file. Missing file model at ${fullLoc}`)

    await saveFile({ ...(fileModel as TFileModel), content })

  }, [repoFiles?.files, rootPrefix])
}
