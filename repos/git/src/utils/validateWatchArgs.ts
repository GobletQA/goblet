import type { TGitWatchOpts } from '@GGT/types'

import { isStr } from '@keg-hub/jsutils/isStr'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'

const throwError = (msg:string|Error) => {
  const err = isStr(msg) ? new Error(msg) : msg
  err.message = `[Git Watch] ${err.message}`

  throw err
}


export const validateWatchArgs = (opts:TGitWatchOpts=emptyObj) => {
  const {
    token,
    local,
    remote,
    branch,
    username,
    provider,
  } = opts

  if(!token) return throwError(`Can not watch goblet repo, missing git token.`)
  if(!branch) return throwError(`Can not watch goblet repo, missing git branch.`)
  if(!local) return throwError(`Can not watch goblet repo, missing repo location.`)
  if(!username) return throwError(`Can not watch goblet repo, missing git username.`)
  if(!provider) return throwError(`Can not watch goblet repo, missing git provider.`)
  if(!remote) return throwError(`Can not watch goblet repo, missing repo remote url.`)

}
