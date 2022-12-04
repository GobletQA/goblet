import type { TFileModel } from '@types'

import { saveApiFile } from '@utils/api'
import { setFile } from '../local/setFile'
import { addToast } from '@actions/toasts'
import { noOpObj } from '@keg-hub/jsutils'

/**
 * Save the content to the given file. if no filePath passed in. it will save it on the currently active file
 * @param {Object} fileToSave - fileModel to be saved on the backend
 *
 * @returns {Object} - {success, fileModel}
 */
export const saveFile = async (fileToSave:TFileModel = noOpObj as TFileModel) => {
  const { location, content, fileType } = fileToSave

  if (!content || !location)
    return console.warn('File content and location are required')

  addToast({
    type: 'info',
    message: `Saving file ${fileToSave.name}!`,
  })

  const resp = await saveApiFile({ location, content, type: fileType })
  if(!resp?.success) return noOpObj as Record<"file", TFileModel>
  
  // After saving the file, update the local store with the saved model
  const savedFile = resp?.data?.file
  savedFile && setFile(savedFile)

  addToast({
    type: 'success',
    message: `File ${fileToSave.name} was saved!`,
  })

  return resp?.data
}
