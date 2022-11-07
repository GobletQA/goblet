import type { TFileType } from '@types'

import { getStore } from '@store'
import { addToast } from '@actions/toasts'
import { noOpObj, isObj } from '@keg-hub/jsutils'
import { setFile } from '@actions/files/local/setFile'
import { createApiFile } from '@utils/api/fileApi'

/**
 * Checks the file extension based on fileType, and adds it if needed
 */
const ensureExtension = (
  fileType:string|TFileType,
  fileName:string,
  isFolder?:boolean,
) => {
  
  const type = isObj(fileType) ? fileType.type : fileType
  
  if(isFolder)
    return {
      file:fileName,
      typeMeta: { type, ext: ``, location: ``, }
    }

  if(fileType === `file`)
    return {
      file:fileName,
      typeMeta: { type, ext: ``, location: fileName }
    }
  
  const { repo } = getStore().getState()

  const fileTypes = repo?.fileTypes
  if(!fileTypes)
    return {
      file: ``,
      typeMeta: noOpObj as TFileType,
      error: `Missing valid file types for repo. Please reconnect the repository`,
    }

  const typeMeta = isObj<TFileType>(fileType) ? fileType : fileTypes[fileType]

  if(!typeMeta || !typeMeta.ext)
    return {
      file: ``,
      typeMeta,
      error: [
        `File type "${fileType}" is misconfigured in the repos "goblet.config.js".`,
        `Please fix configuration for this file type to resolve the issue.`
      ].join(`\n`),
    }

  const ext = typeMeta.ext
  if (!fileName.includes('.')) return {file: `${fileName}.${ext}`, typeMeta}

  const last = fileName.split('.').pop()
  return last === ext
    ? {file: fileName, typeMeta }
    : {
        file: ``,
        typeMeta,
        error: [
          `Invalid extension ".${last}".`,
          `Files of type "${fileType}" must include ".${ext}" at the end.`
        ].join(`\n`),
      }
}

/**
 * Creates a new file from the passed in fileModel
 *
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

  const resp = await createApiFile({
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
