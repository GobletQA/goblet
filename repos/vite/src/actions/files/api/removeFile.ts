import type { TFileModel } from '@types'

import { noOpObj } from '@keg-hub/jsutils'
import { addToast } from '@actions/toasts'
import { filesApi } from '@services/filesApi'
import { removeFile as removeFileLocal } from '@actions/files/local/removeFile'

export type TRemoveFileLoc = {
  name:string
  location: string
}

/**
 * Deletes a file via the path from the passed in fileModel
 * @param {Object} fileModel - The fileModel of the file to be removed
 *
 * @returns {Object} - {success}
 */
export const removeFile = async (fileModel:TFileModel|TRemoveFileLoc) => {
  addToast({
    type: 'warn',
    message: `Removing file ${fileModel.name}!`,
  })

  const resp = await filesApi.deleteFile(fileModel.location)
  if(!resp?.success) return noOpObj

  // Remove the file locally
  removeFileLocal(fileModel.location)

  if(!resp.data || !resp.data.location)
    return addToast({
      type: `error`,
      message: `File was removed, but server returned an invalid response`,
    })
  
  addToast({
    type: `success`,
    message: `The file ${fileModel.name} was removed!`,
  })


  return resp?.data
}
