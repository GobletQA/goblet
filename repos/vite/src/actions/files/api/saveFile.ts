import type { TFileResp, TFileModel } from '@types'

import { getStore } from '@store'
import { setFile } from '../local/setFile'
import { addToast } from '@actions/toasts'
import { noOpObj } from '@keg-hub/jsutils'
import { filesApi } from '@services/filesApi'
import { setWorld } from '@actions/repo/local/setWorld'
import { getRootPrefix } from '@utils/repo/getRootPrefix'

/**
 * Save the content to the given file. if no filePath passed in. it will save it on the currently active file
 *
 */
export const saveFile = async (
  fileToSave:TFileModel = noOpObj as TFileModel
) => {
  const { location, content, fileType } = fileToSave

  if (!content || !location)
    return console.warn(`[File Save Error]: File content and location are required`)

  addToast({
    type: 'info',
    message: `Saving file ${fileToSave.name}!`,
  })

  const resp = await filesApi.saveFile<TFileResp>({ location, content, type: fileType })
  if(!resp?.success) return noOpObj as TFileResp
  
  // After saving the file, update the local store with the saved model
  const savedFile = resp?.data?.file
  savedFile && setFile(savedFile)

  addToast({
    type: 'success',
    message: `File ${fileToSave.name} was saved!`,
  })

  // Check if it was the world file that was updated
  // If it was, then update the saved world content of the repo store
  const repo = getStore()?.getState().repo
  savedFile.uuid === getRootPrefix(repo, repo?.paths?.world)
    && setWorld(savedFile)

  return resp?.data
}
