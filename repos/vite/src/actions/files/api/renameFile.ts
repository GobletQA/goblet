import type { TFileResp } from '@types'

import { exists, emptyObj } from '@keg-hub/jsutils'
import { addToast } from '@actions/toasts'
import { filesApi } from '@services/filesApi'
import { renameFile as renameFileLocal } from '@actions/files/local/renameFile'


/**
 * Save the content to the given file. if no filePath passed in. it will save it on the currently active file
 */
export const renameFile = async (
  oldLoc:string,
  newLoc:string,
  content?:string
) => {

  if (!oldLoc || !newLoc)
    return console.warn('Old file location and new file location are required')

  addToast({
    type: `info`,
    message: `Renaming file to ${newLoc}!`,
  })


  const resp = await filesApi.renameFile({
    oldLoc,
    newLoc,
    ...(exists(content) ? { content } : emptyObj)
  })

  if(!resp?.success) return emptyObj as TFileResp

  addToast({
    type: `success`,
    message: `File was renamed to ${newLoc}!`,
  })

  const { file } = resp?.data
  file && renameFileLocal(oldLoc, newLoc, file)

  return resp?.data
}
