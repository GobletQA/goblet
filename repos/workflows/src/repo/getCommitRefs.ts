/**

curl -H "Authorization: token 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" -H "Content-Type: application/json" -H "Accept: application/vnd.github+json" https://api.github.com/repos/GobletQA/gobletqa/git/matching-refs

 */
import type { TGitOpts } from '@gobletqa/workflows/types'

import axios, { AxiosRequestConfig } from 'axios'
import { limbo } from '@keg-hub/jsutils'
import { GitHubApi } from '../providers'
import { Logger } from '@keg-hub/cli-utils'
import { throwGitError } from '../utils/throwGitError'

export const getCommitRefs = async ({ branch, remote, token, log }:TGitOpts) => {
  const remoteUrl = GitHubApi.buildAPIUrl(remote, [`git/matching-refs/`])
  const params = {
    method: 'GET',
    url: `${remoteUrl}`,
    headers: GitHubApi.buildHeaders(token),
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

