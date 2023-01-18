import type { TFileResp, TFileType } from '@types'

import { noOpObj } from '@keg-hub/jsutils'
import { addToast } from '@actions/toasts'
import { filesApi } from '@services/filesApi'
import { setFile } from '@actions/files/local/setFile'
import { ensureExtension } from '@utils/files/ensureExtension'

/**
 * Creates a new file from the passed in fileModel
 */
export const createFile = async (
  fileType:string|TFileType,
  fileName:string,
  isFolder?:boolean,
) => {
  const { file, typeMeta, error } = ensureExtension(fileType, fileName, isFolder)

  if (error)
    return addToast({
      type: `error`,
      timeout: 10000,
      message: error,
    })

  addToast({
    type: 'info',
    message: `Creating new file ${file}!`,
  })

  const resp = await filesApi.createFile<TFileResp>({
    location: file,
    type: typeMeta.type,
  })
  if(!resp?.success) return noOpObj

  const { file: fileModel } = resp?.data
  
  if(!fileModel)
    return addToast({
      type: 'error',
      message: `File was created, but server returned an invalid response`,
    })
  
  addToast({
    type: 'success',
    message: `New file ${fileModel.name} was created!`,
  })

  setFile(fileModel)

  return resp?.data
}
