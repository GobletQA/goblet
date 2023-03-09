import type { TFileResp, TFileModel } from '@types'

import { setFile } from '../local/setFile'
import { addToast } from '@actions/toasts'
import { noOpObj } from '@keg-hub/jsutils'
import { filesApi } from '@services/filesApi'

/**
 * Save the content to the given file. if no filePath passed in. it will save it on the currently active file
 *
 */
export const saveFile = async (
  fileToSave:TFileModel = noOpObj as TFileModel
) => {
  const { location, content, fileType } = fileToSave

  if (!content || !location)
    return console.warn('File content and location are required')

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

  return resp?.data
}
