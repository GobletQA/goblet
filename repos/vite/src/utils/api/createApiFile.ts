import type { TFileModel } from '@types'
import { HttpMethods } from '@constants'
import { apiRepoRequest } from './apiRepoRequest'
import { addToast } from '@actions/toasts/addToast'

type TCreateApiFile = {
  name:string,
  type:string
}

/**
 * Helper to make file create requests to the Backend API
 * @function
 * @export
 * @public
 * @param {string} name - Name of the file to be saved
 * @param {string} type - Test Type of of the file
 *
 * @returns {*} - Response from the Backend API or callback function when it exists
 */
export const createApiFile = async ({ name, type }:TCreateApiFile) => {
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
