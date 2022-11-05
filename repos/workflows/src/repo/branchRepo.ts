/**
 * 1. Find the revision you want to branch from
 *  https://api.github.com/repos/<AUTHOR>/<REPO>/git/refs/heads
 * 2. Pull the revision hash from the response
 * 3. Then does a POST request to github API
 *  * URL: https://api.github.com/repos/<AUTHOR>/<REPO>/git/refs
 *  * Data: { ref: `refs/heads/${newBranch}`, sha: <hash-from-step-2> }
 */

import axios, { AxiosRequestConfig } from 'axios'
import { limbo } from '@keg-hub/jsutils'
import { Logger } from '@keg-hub/cli-utils'
import { throwGitError, buildHeaders, buildAPIUrl } from './gitUtils'
import { TGitOpts } from '@gobletqa/workflows/types'


const getBranchHash = async ({ branch, remote, token, log }:TGitOpts) => {
  const remoteUrl = buildAPIUrl(remote, [`git/refs`])
  const params = {
    method: 'GET',
    url: `${remoteUrl}/heads/${branch}`,
    headers: buildHeaders(token),
  } as AxiosRequestConfig

  log !== false && Logger.log(`Get Repo SHA Request Params:\n`, params)
  const [err, resp] = await limbo(axios(params))

  err &&
    throwGitError(
      err,
      remoteUrl,
      `[WRK-FL BRANCH] Github API error while getting branch ${branch} sha`
    )

  return (
    (resp?.data?.object?.sha as string) ||
    throwGitError(
      new Error(resp?.data),
      remoteUrl,
      `[WRK-FL BRANCH] Branch sha does not exist in Github API response`
    )
  )
}

/**
 * Uses the github API to create a new branch based on the passed in git options
 */
const createNewBranch = async ({
  log,
  token,
  remote,
  branch,
  newBranch,
}:TGitOpts, hash:string) => {

  const remoteUrl = buildAPIUrl(remote, [`git/refs`])
  newBranch = newBranch || `${branch}-${new Date().getTime()}`
  log !== false && Logger.log(`Create Branch Names: ${newBranch}`)

  const params = {
    method: 'POST',
    url: remoteUrl,
    headers: buildHeaders(token),
    data: {
      sha: hash,
      ref: `refs/heads/${newBranch}`,
    },
  } as AxiosRequestConfig

  log !== false && Logger.log(`Create Branch Request Params:\n`, params)

  const [err] = await limbo(axios(params))

  err &&
    throwGitError(
      err,
      remoteUrl,
      `[WRK-FL BRANCH] Github API error while getting branch ${branch} sha`
    )

  return newBranch
}

/**
 * Workflow for creating a new branch within a git repo from the default branch
 * @function
 * @public
 * @throws
 * See this gist for more info => https://gist.github.com/potherca/3964930
 *
 * @returns {string} - Name of the newly created branch
 */
export const branchRepo = async (gitArgs:TGitOpts) => {
  const hash = await getBranchHash(gitArgs)
  return await createNewBranch(gitArgs, hash as string)
}
