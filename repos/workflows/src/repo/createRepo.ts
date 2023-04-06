import type { TGitOpts, TGitCreateRepo } from '@gobletqa/workflows/types'


/**
 * Create a new repo by making a post request to github's API
 * @example - User
 * curl -H "Authorization: token ACCESS_TOKEN" \
 *   --data '{"name":"NEW_REPO_NAME"}' \
 *   https://api.github.com/user/repos
 *
 * @example - Organization
 * curl -H "Authorization: token ACCESS_TOKEN" \
 * --data '{"name":"NEW_REPO_NAME", "description": "", "private": true, "auto_init": true }' \
 * https://api.github.com/orgs/ORGANIZATION_NAME/repos

*/

import { GitHubApi } from '../providers'
import { Logger } from '@keg-hub/cli-utils'
import axios, { AxiosRequestConfig } from 'axios'
import { limbo, deepMerge } from '@keg-hub/jsutils'
import { throwGitError } from '../utils/throwGitError'

const createOpts = {
  override: {
    private: true,
    has_wiki: true,
    has_issues: true,
    has_projects: true,
    allow_merge_commit: false,
    delete_branch_on_merge: false,
  },
  force: {
    auto_init: true,
  },
}


/**
 * Creates a new repo by calling github's API via axios
 * Force auth_init: true which create a commit that can be used to create branches from
 */
export const createRepo = async ({ remote, token, log, branch }:TGitOpts, opts:TGitCreateRepo) => {
  const remoteUrl = GitHubApi.buildAPIUrl(remote)

  const params = {
    method: 'POST',
    url: remoteUrl,
    headers: GitHubApi.buildHeaders(token),
    data: deepMerge(
      createOpts,
      opts,
      { auto_init: true }
    ),
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
