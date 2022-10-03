import type { TAPIReposResp } from '@types'
import { setRepos } from '../local/setRepos'
import { addToast } from '@actions/toasts/addToast'
import { apiRepoRequest } from '@utils/api/apiRepoRequest'

/**
 * Gets all repos for the logged in user from the authorized provider
 * Then adds them to store, overwriting any existing provider repos
 */
export const getRepos = async () => {
  addToast({
    type: 'info',
    message: `Getting repos list from provider`,
  })

  const {
    data,
    error,
    success
  } = await apiRepoRequest<TAPIReposResp>(`/repo/all`)

  if(!success || error)
    addToast({
      type: 'error',
      message: `Error loading repos from provider, please try again later.`,
    })

  data.repos && setRepos(data)

  return data.repos
}