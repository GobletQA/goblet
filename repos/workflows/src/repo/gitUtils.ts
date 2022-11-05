
/**
 * TODO set this ENV in the config => GIT_REPO_HOST
 */

import url from 'url'
import path from 'path'
import { Logger } from '@keg-hub/cli-utils'
import { throwErr } from '../utils/throwErr'

/**
 * Throws an error when a git workflow fails
 * If a message is passed the message is also loged
 *
 * @returns {void}
 */
export const throwGitError = (
  err:Error,
  remoteUrl:string='Unknown',
  message:string
) => {
  message && Logger.error(message)
  console.error(err.stack)
  Logger.empty()

  throwErr(`Error when calling git API - ${remoteUrl}`)
}

/**
 * Builds the request headers for calling github Api V3
 * Adds the Authorization header when the token exists
 *
 * @returns {Object} - Request header object
 */
export const buildHeaders = (token:string) => ({
  ...(token && { Authorization: `token ${token}` }),
  'Content-Type': `application/json`,
  Accept: `application/vnd.github+json`,
})

/**
 * Builds a github api url based on the passed in remote
 */
export const buildAPIUrl = (remote:string, pathExt:string[]=[]) => {
  const repoUrl = new url.URL(remote)
  repoUrl.host = process.env.GIT_REPO_HOST || 'api.github.com'
  repoUrl.pathname = path.join(`repos`, repoUrl.pathname, ...pathExt)

  return repoUrl.toString()
}
