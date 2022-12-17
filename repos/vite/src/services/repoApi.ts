import type { TRequest } from '@services/axios.types'

import { apiRequest } from '@utils/api/apiRequest'
import { isObj, deepMerge } from '@keg-hub/jsutils'
import { formatRepoUrl } from '@utils/api/apiHelpers'
import { getRepoData } from '@utils/store/getStoreData'

const buildRequest = (request:TRequest|string) => {
  const req = isObj<TRequest>(request) ? request : { url: request }

  const repoData = getRepoData()
  req.url = formatRepoUrl(repoData.name, req.url)
  
  return deepMerge(
    {
      params: {
        local: repoData?.git?.local,
        remote: repoData?.git?.remote,
        branch: repoData?.git?.branch,
      },
    },
    req
  )
}

class RepoApi {

  definitions = async () => {
    const req = buildRequest(`/definitions`)
    return await apiRequest(req)
  }

  features = async () => {
    const req = buildRequest(`/features`)
    return await apiRequest(req)
  }

}

export const screencastApi = new RepoApi()