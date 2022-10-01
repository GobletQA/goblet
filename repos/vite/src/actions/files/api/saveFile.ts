import type { TFileModel } from '@types'

import { saveApiFile } from '@utils/api'
import { addToast } from '@actions/toasts'
import { noOpObj } from '@keg-hub/jsutils'
import { removePendingFile } from '../local/removePendingFile'

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

  removePendingFile(fileToSave)
  addToast({
    type: 'success',
    message: `File ${fileToSave.name} was saved!`,
  })

  return resp?.data
}
