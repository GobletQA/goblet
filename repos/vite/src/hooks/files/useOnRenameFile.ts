import type { TFileTree } from '@types'

import { useCallback } from 'react'
import {exists} from '@keg-hub/jsutils'
import { addRootToLoc } from '@utils/repo/addRootToLoc'
import { renameFile } from '@actions/files/api/renameFile'

export const useOnRenameFile = (files:TFileTree, rootPrefix:string) => {
  return useCallback(async (oldFile:string, newFile:string, content?:string) => {

    if(!oldFile) console.warn(`Can not rename file, missing old file location`)
    if(!newFile) console.warn(`Can not rename file, missing new file location`)

    const oldLoc = addRootToLoc(oldFile, rootPrefix)
    const newLoc = addRootToLoc(newFile, rootPrefix)

    await renameFile(
      oldLoc,
      newLoc,
      exists(content) ? content : undefined
    )

  }, [files, rootPrefix])
}
