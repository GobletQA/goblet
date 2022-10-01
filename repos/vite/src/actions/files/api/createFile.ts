import { getStore } from '@store'
import { noOpObj } from '@keg-hub/jsutils'
import { addToast } from '@actions/toasts'
import { createApiFile } from '@utils/api/createApiFile'
import { getFileTree } from '@actions/files/api/getFileTree'

// TODO: figure how this is going to be handled now ???
import { setActiveFileFromType } from '../local/setActiveFileFromType'

/**
 * Checks the file extension based on fileType, and adds it if needed
 */
const ensureExtension = (fileType:string, fileName:string) => {
  const { repo } = getStore().getState()
  const fileTypes = repo?.fileTypes

  if(!fileTypes || !fileTypes[fileType])
    return { error: `Missing valid file types for repo. Please reconnect the repository`, file: `` }

  const typeMeta = fileTypes[fileType]
  if(!typeMeta || !typeMeta.ext)
    return {error: [
      `File type "${fileType}" is misconfigured in the repos "goblet.config.js".`,
      `Please fix configuration for this file type to resolve the issue.`
    ].join(`\n`), file: ``}

  const ext = typeMeta.ext
  if (!fileName.includes('.')) return {file: `${fileName}.${ext}`}

  const last = fileName.split('.').pop()
  return last === ext
    ? {file: fileName}
    : {error: [
        `Invalid extension ".${last}".`,
        `Files of type "${fileType}" must include ".${ext}" at the end.`
      ].join(`\n`), file: ``}
}

/**
 * Creates a new file from the passed in fileModel
 *
 */
export const createFile = async (fileType:string, fileName:string, screenId:string) => {
  const { file, error } = ensureExtension(fileType, fileName)

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
    name: file,
    type: fileType,
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

  // reload the file tree after the new file was created
  getFileTree()

  // TODO: figure how this is going to be handled now ???
  // screenId && setActiveFileFromType(fileModel, screenId)

  return resp?.data
}
