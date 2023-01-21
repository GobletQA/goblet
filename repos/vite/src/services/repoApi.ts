import type { TRequest } from '@services/axios.types'
import type {
  TFileTree,
  TApiDefinitionsResp,
  TFeatureFileModelList
} from '@types'

import { HttpMethods } from '@constants'
import { apiRequest } from '@utils/api/apiRequest'
import { buildRepoReq } from '@utils/api/apiHelpers'

type TApiRecord = Record<any, any>
type TRParams<R> = Partial<Omit<TRequest<R>, |`url`|`method`>>
export type TFeatureFilesResp = Record<`features`, TFeatureFileModelList>

class RepoApi {

  /**
   * Internal method, that all other methods call to make an API request
   * @private
   */
  _req = async <T,R=TApiRecord>(opts:string|TRequest<R>) => await apiRequest<T>(buildRepoReq(opts))

  fileTree = async <T=TFileTree,R=TApiRecord>() => this._req<T, R>(`/files/tree`)

  features = async <T=TFeatureFilesResp,R=TApiRecord>() => await this._req<T, R>(`/features`)

  definitions = async <T=TApiDefinitionsResp,R=TApiRecord>() => await this._req<T, R>(`/definitions`)

  disconnect = async <T=TApiRecord,R=TApiRecord>(params:TRParams<R>) => this._req<T,R>({
    ...params,
    method: HttpMethods.POST,
    url: `/repo/disconnect`,
  } as TRequest<R>)

  connect = async <T=TApiRecord,R=TApiRecord>(params:TRParams<R>) => this._req<T,R>({
    ...params,
    method: HttpMethods.POST,
    url: `/repo/connect`,
  } as TRequest<R>)

  getRepos = async <T=TApiRecord,R=TApiRecord>(params:TRParams<R>) => await this._req<T, R>({
    ...params,
    method: `GET`,
    url: `/repo/all`,
  } as TRequest<R>)

}

export const repoApi = new RepoApi()