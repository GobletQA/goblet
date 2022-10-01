import type { TFileModel } from '@types'
import { HttpMethods } from '@constants'
import { apiRepoRequest } from './apiRepoRequest'
import { addToast } from '@actions/toasts/addToast'

export type TFileApi = {
  location:string
}

export type TSaveFile = {
  type:string
  location:string,
  content:string,
}

export type TCreateFile = {
  name:string
  type:string
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
export const createApiFile = async ({ name, type }:TCreateFile) => {
  if(!name || !type)
    return addToast({
      type: 'error',
      message: [
        `Failed to create file. The file name and type are required`,
        `Name: ${name}`,
        `Type: ${type}`
      ].join(`\n`)
    })

  const resp = await apiRepoRequest<Record<'file', TFileModel>>({
    method: HttpMethods.POST,
    url: `/files/create`,
    params: { name, type },
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
