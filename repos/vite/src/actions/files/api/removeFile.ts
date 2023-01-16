import type { TFileModel } from '@types'

import { noOpObj } from '@keg-hub/jsutils'
import { getFileTree } from './getFileTree'
import { addToast } from '@actions/toasts'
import { filesApi } from '@services/filesApi'

export type TRemoveFileLoc = {
  name:string
  location: string
}

// Not currently using an active file. Monaco manages that for us
// import { clearActiveFile } from '../local/clearActiveFile'

/**
 * Deletes a file via the path from the passed in fileModel
 * @param {Object} fileModel - The fileModel of the file to be removed
 * @param {string} screenId - Id of the screen that has the file active
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

  if(!resp.data || !resp.data.location)
    return addToast({
      type: 'error',
      message: `File was removed, but server returned an invalid response`,
    })
  
  addToast({
    type: 'success',
    message: `The file ${fileModel.name} was removed!`,
  })

  // clearActiveFile()
  // reload the file tree after the file was removed
  getFileTree()

  return resp?.data
}
