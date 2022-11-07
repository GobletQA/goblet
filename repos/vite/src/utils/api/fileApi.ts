import type { TFileModel } from '@types'
import { HttpMethods } from '@constants'
import { apiRepoRequest } from './apiRepoRequest'
import { addToast } from '@actions/toasts/addToast'

export type TFileApi = {
  location:string
}

export type TSaveFile = {
  type:string
  content:string
  location:string
}

export type TCreateFile = {
  type:string
  location:string
}

export type TRenameFile = {
  oldLoc:string
  newLoc:string
}

/**
 * Helper to make file save requests to the Backend API
 * @function
 * @export
 * @public
 * @param {string} filePath - Path to the file to be saved on the backend
 * @param {string} content - Text content to save to the file
 *
 * @returns {Object} - Response from the Backend API or callback function when it exists
 */
export const saveApiFile = async ({
  type,
  content,
  location,
}:TSaveFile) => {
  if(!location)
    return addToast({
      type: 'error',
      message: [
        `Failed to save file. A file path is required`,
        `FilePath: ${location}`
      ].join(`\n`)
    })
    
  const resp = await apiRepoRequest<Record<'file', TFileModel>>({
    url: `/files/save`,
    method: HttpMethods.POST,
    params: {
      type,
      content,
      path: location,
    },
  })

  if(!resp?.success || resp?.error)
    addToast({
        type: 'error',
        message: resp?.error || `Error saving file, please try again later.`,
      })

  return resp
}

/**
 * Helper to make file load requests to the Backend API
 * @function
 * @export
 * @public
 */
export const loadApiFile = async ({ location }:TFileApi) => {
  if(!location)
    return addToast({
      type: 'error',
      message: [
        `Failed to load file. A file path is required`,
        `FilePath: ${location}`
      ].join(`\n`)
    })
  
  const resp = await apiRepoRequest<Record<'file', TFileModel>>(`/files/load?path=${location}`)

  if(!resp?.success || resp?.error)
    addToast({
      type: 'error',
      message: resp?.error || `Error loading file, please try again later.`,
    })

  return resp
}

/**
 * Helper to make file create requests to the Backend API
 * @function
 * @export
 * @public
 *
 * @returns {*} - Response from the Backend API or callback function when it exists
 */
export const createApiFile = async ({ location, type }:TCreateFile) => {
  if(!location || !type)
    return addToast({
      type: 'error',
      message: [
        `Failed to create file. The file location and type are required`,
        `Location: ${location}`,
        `Type: ${type}`
      ].join(`\n`)
    })

  const resp = await apiRepoRequest<Record<'file', TFileModel>>({
    method: HttpMethods.POST,
    url: `/files/create`,
    params: { location, type },
  })

  if(!resp?.success || resp?.error)
    addToast({
      type: 'error',
      message: resp?.error || `Error creating file, please try again later.`,
    })

  return resp
}

/**
 * Helper to make file delete requests to the Backend API
 * @function
 * @export
 * @public
 *
 * @returns {Object} - Response from the Backend API or callback function when it exists
 */
export const deleteApiFile = async ({ location }:TFileApi) => {
  if(!location)
    return addToast({
      type: 'error',
      message: [
        `Failed to delete file. A file path is required`,
        `FilePath: ${location}`
      ].join(`\n`)
    })
  
  const resp = await apiRepoRequest<Record<'location', string>>({
    method: 'delete',
    url: `/files/delete`,
    params: { file: location },
  })

  if(!resp?.success || resp?.error)
    addToast({
      type: 'error',
      message: resp?.error || `Error deleting file, please try again later.`,
    })

  return resp
}


/**
 * Helper to make a file rename requests to the Backend API
 *
 */
export const renameApiFile = async ({
  oldLoc,
  newLoc,
}:TRenameFile) => {

  if(!oldLoc)
    return addToast({
      type: `error`,
      message: `Failed to rename file. An old file path is required`
    })

  if(!newLoc)
    return addToast({
      type: `error`,
      message: `Failed to rename file. A new file path is required`
    })

  const resp = await apiRepoRequest<Record<'file', TFileModel>>({
    url: `/files/rename`,
    method: HttpMethods.POST,
    params: {
      oldLoc,
      newLoc
    },
  })

  if(!resp?.success || resp?.error)
    addToast({
        type: 'error',
        message: resp?.error || `Error renaming file, please try again later.`,
      })

  return resp
}
