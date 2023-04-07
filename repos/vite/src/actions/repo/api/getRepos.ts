import type { TAPIReposResp } from '@types'
import { repoApi } from '@services/repoApi'
import { emptyObj, emptyArr } from '@keg-hub/jsutils'
import { setRepos } from '../local/setRepos'
import { addToast } from '@actions/toasts/addToast'


type TErrorCB = (message:string) => void

/**
 * Gets all repos for the logged in user from the authorized provider
 * Then adds them to store, overwriting any existing provider repos
 */
export const getRepos = async (errorCB?:TErrorCB) => {
  addToast({
    type: 'info',
    message: `Getting repos list from provider`,
  })

  const {
    data,
    error,
    success
  } = await repoApi.getRepos<TAPIReposResp>(emptyObj)

  if(!success || error){
    const message = `Error loading repos from provider, please try again later.`
    addToast({
      message,
      type: 'error',
    })

    errorCB?.(error || message)

    return emptyArr
  }

  data.repos && setRepos(data)

  return data.repos
}