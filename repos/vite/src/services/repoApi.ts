import type { TRequest } from '@services/axios.types'

import { apiRequest } from '@utils/api/apiRequest'
import { isObj, deepMerge } from '@keg-hub/jsutils'
import { formatRepoUrl } from '@utils/api/apiHelpers'
import { getRepoData } from '@utils/store/getStoreData'

type TRParams = Partial<TRequest>
type TApiRecord = Record<any, any>

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

  _req = async <T>(opts:string|TRequest) => await apiRequest<T>(buildRequest(opts))

  disconnect = async <T=Record<any, any>>(params:TRParams) => {
    const req = buildRequest({
      ...params,
      method: `POST`,
      url: `/repo/disconnect`,
    })

    return await apiRequest<T>(req)
  }

  connect = async <T=TApiRecord>(params:TRParams) => this._req<T>({
    ...params,
    method: `POST`,
    url: `/repo/connect`,
  })

  getRepos = async <T=TApiRecord>(params:TRParams) => await this._req<T>({
    ...params,
    method: `GET`,
    url: `/repo/all`,
  })

  features = async () => await this._req(`/features`)
  definitions = async () => await this._req(`/definitions`)


}

export const repoApi = new RepoApi()