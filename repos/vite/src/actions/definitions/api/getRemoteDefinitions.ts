import { repoApi } from '@services/repoApi'
import { addToast } from '@actions/toasts/addToast'
import { setDefinitions } from '../local/setDefinitions'


/**
 * Calls the API backend to load the parsed step definitions
 * Then calls setDefinitions, to add them to the Store
 */
export const getRemoteDefinitions = async () => {
  addToast({
    type: `info`,
    message: `Syncing step definitions with server!`,
  })

  const {
    data,
    error,
    success
  } = await repoApi.definitions()
  

  if (!success || error)
    return addToast({
      type: 'error',
      message: error || `Error loading Step Definitions, please try again later.`,
    })
  
  const { definitions } = data

  definitions && setDefinitions(definitions)

  return { definitions }
}
