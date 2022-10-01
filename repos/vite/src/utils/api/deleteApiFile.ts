import { apiRepoRequest } from './apiRepoRequest'
import { addToast } from '@actions/toasts/addToast'

/**
 * Helper to make file delete requests to the Backend API
 *
 * @returns {Object} - Response from the Backend API or callback function when it exists
 */
export const deleteApiFile = async ({ location }:Record<'location', string>) => {
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
