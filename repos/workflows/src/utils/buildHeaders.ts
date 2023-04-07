import type { TGitReqHeaders } from '../types'

import { Rest } from '../constants'
import { emptyObj } from '@keg-hub/jsutils'

export type TBuildHeaders = {
  token:string
  headers?: TGitReqHeaders
  provider: typeof Rest[`Github`] | typeof Rest[`Gitlab`]
}

export const buildHeaders = (props:TBuildHeaders) => {
  const { token, headers, provider } = props
  const { AuthHeader, Headers=emptyObj } = provider
  const { Ref, Key } = AuthHeader

  return {
    [`Content-Type`]: `application/json`,
    ...Headers,
    ...headers,
    [Key]: `${Ref} ${token}`
  }

}