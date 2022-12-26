import type { TRequest } from '@services/axios.types'

import { apiRequest } from '@utils/api/apiRequest'
import { isObj, deepMerge } from '@keg-hub/jsutils'
import { formatRepoUrl } from '@utils/api/apiHelpers'
import { getRepoData } from '@utils/store/getStoreData'

const buildRequest = (request:TRequest|string) => {
  const req = isObj<TRequest>(request) ? request : { url: request }

  const repoData = getRepoData()
  req.url = formatRepoUrl(repoData.name, req.url)
  
  return deepMerge<TRequest>(
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

  connect = async <T=Record<any, any>>(params:Partial<TRequest>) => {
    const req = buildRequest({
      ...params,
      method: `POST`,
      url: `/repo/connect`,
    })

    return await apiRequest<T>(req)
  }

  disconnect = async <T=Record<any, any>>(params:Partial<TRequest>) => {
    const req = buildRequest({
      ...params,
      method: `POST`,
      url: `/repo/disconnect`,
    })

    return await apiRequest<T>(req)
  }

  getRepos = async <T=Record<any, any>>(params:Partial<TRequest>) => {
    const req = buildRequest({
      ...params,
      method: `GET`,
      url: `/repo/all`,
    })

    return await apiRequest<T>(req)
  }

  definitions = async () => {
    const req = buildRequest(`/definitions`)
    return await apiRequest(req)
  }

  features = async () => {
    const req = buildRequest(`/features`)
    return await apiRequest(req)
  }

}

export const repoApi = new RepoApi()