

/**
 * Create a new repo by making a post request to github's API
 * @example - User
 * curl -H "Authorization: token ACCESS_TOKEN" \
 *   --data '{"name":"NEW_REPO_NAME"}' \
 *   https://api.github.com/user/repos
 *
 * @example - Organization
 * curl -H "Authorization: token ACCESS_TOKEN" \
 * --data '{"name":"NEW_REPO_NAME"}' \
 * https://api.github.com/orgs/ORGANIZATION_NAME/repos
*/

import { limbo } from '@keg-hub/jsutils'
import { Logger } from '@keg-hub/cli-utils'
import axios, { AxiosRequestConfig } from 'axios'
import { throwGitError, buildHeaders, buildAPIUrl } from './gitUtils'

import { TGitOpts } from '@gobletqa/workflows/types'

/**
 * TODO - Creates a new repo by calling github's API via axios
 * Figure out how to set the default branch or call the create branch right after this method
 */
export const createRepo = async ({ remote, token, log, branch }:TGitOpts, repoName:string) => {
  const remoteUrl = buildAPIUrl(remote)

  const params = {
    method: 'POST',
    url: remoteUrl,
    data: { repoName },
    headers: buildHeaders(token),
  } as AxiosRequestConfig

  log && Logger.log(`Create Repo Request Params:\n`, params)

  const [err] = await limbo(axios(params))

  err &&
    throwGitError(
      err,
      remoteUrl,
      `[WRK-FL BRANCH] Github API error while getting creating repo ${branch} sha`
    )

  return branch
}
