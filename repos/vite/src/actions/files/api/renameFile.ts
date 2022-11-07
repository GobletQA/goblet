import type { TFileModel } from '@types'

import { noOpObj } from '@keg-hub/jsutils'
import { renameApiFile } from '@utils/api'
import { addToast } from '@actions/toasts'
import { setFile } from '@actions/files/local/setFile'
import { renameFile as renameFileLoc } from '@actions/files/local/renameFile'


/**
 * Save the content to the given file. if no filePath passed in. it will save it on the currently active file
 */
export const renameFile = async (
  oldLoc:string,
  newLoc:string
) => {

  if (!oldLoc || !newLoc)
    return console.warn('Old file location and new file location are required')

  addToast({
    type: `info`,
    message: `Renaming file to ${newLoc}!`,
  })

  const resp = await renameApiFile({
    oldLoc,
    newLoc
  })
  if(!resp?.success) return noOpObj as Record<"file", TFileModel>

  addToast({
    type: `success`,
    message: `File was renamed to ${newLoc}!`,
  })

  const { file } = resp?.data
  file && renameFileLoc(oldLoc, newLoc, file)

  return resp?.data
}
