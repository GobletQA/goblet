/**

curl -H "Authorization: token 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" -H "Content-Type: application/json" -H "Accept: application/vnd.github+json" https://api.github.com/repos/GobletQA/gobletqa/git/matching-refs

 */

import axios, { AxiosRequestConfig } from 'axios'
import { limbo } from '@keg-hub/jsutils'
import { Logger } from '@keg-hub/cli-utils'
import { throwGitError, buildHeaders, buildAPIUrl } from './gitUtils'
import { TGitOpts } from '@gobletqa/workflows/types'

export const getCommitRefs = async ({ branch, remote, token, log }:TGitOpts) => {
  const remoteUrl = buildAPIUrl(remote, [`git/matching-refs/`])
  const params = {
    method: 'GET',
    url: `${remoteUrl}`,
    headers: buildHeaders(token),
  } as AxiosRequestConfig


  log !== false && Logger.log(`Get Repo SHA Request Params:\n`, params)
  const [err, resp] = await limbo(axios(params))

  err &&
    throwGitError(
      err,
      remoteUrl,
      `[WRK-FL REFs] Github API error while getting refs from ${remoteUrl}`
    )

  console.log(`------- List of commit SHAs -------`)
  console.log(resp?.data)
}

