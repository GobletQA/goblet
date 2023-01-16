import type { TRequest } from '@services/axios.types'
import type {
  TFileTree,
  TApiDefinitionsResp,
  TFeatureFileModelList
} from '@types'

import { HttpMethods } from '@constants'
import { apiRequest } from '@utils/api/apiRequest'
import { buildRepoReq } from '@utils/api/apiHelpers'

type TRParams = Partial<TRequest>
type TApiRecord = Record<any, any>
export type TFeatureFilesResp = Record<`features`, TFeatureFileModelList>

class RepoApi {

  /**
   * Internal method, that all other methods call to make an API request
   * @private
   */
  _req = async <T>(opts:string|TRequest) => await apiRequest<T>(buildRepoReq(opts))

  fileTree = async <T=TFileTree>() => this._req<T>(`/files/tree`)

  features = async <T=TFeatureFilesResp>() => await this._req<T>(`/features`)

  definitions = async <T=TApiDefinitionsResp>() => await this._req<T>(`/definitions`)

  disconnect = async <T=TApiRecord>(params:TRParams) => this._req<T>({
    ...params,
    method: HttpMethods.POST,
    url: `/repo/disconnect`,
  })

  connect = async <T=TApiRecord>(params:TRParams) => this._req<T>({
    ...params,
    method: HttpMethods.POST,
    url: `/repo/connect`,
  })

  getRepos = async <T=TApiRecord>(params:TRParams) => await this._req<T>({
    ...params,
    method: `GET`,
    url: `/repo/all`,
  })

}

export const repoApi = new RepoApi()