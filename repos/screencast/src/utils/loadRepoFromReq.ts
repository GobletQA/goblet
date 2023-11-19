import type { TGitOpts } from '@GSC/types'
import type { Request as EXRequest } from 'express'
import type { Request as JWTRequest } from 'express-jwt'
import type { TWFGobletConfig } from '@gobletqa/workflows'


import { Workflows } from '@gobletqa/workflows'
import { pickKeys } from '@keg-hub/jsutils/pickKeys'
import { deepMerge } from '@keg-hub/jsutils/deepMerge'


/**
 * Gets the git keys off the request for all request types
 */
const getRepoGit = ({ query, params, body }:JWTRequest) => {
  return pickKeys(deepMerge(params, query, body), [
    `path`,
    `local`,
    `remote`,
    `branch`,
  ])
}

/**
 * Loads a Repo class instance for the request
 * Ensures valid meta-data was passed with the request via the JWT
 * Otherwise throws an error
 */
export const loadRepoFromReq = async (
  req:JWTRequest|EXRequest<any, any, any, any>,
) => {
  const config:TWFGobletConfig = req.app.locals.config
  const repoGit = getRepoGit(req)

  if (!repoGit || !repoGit.local)
    throw new Error(`Endpoint requires a locally mounted path, I.E. /repos/:repo-name/*`)

  const { iat, exp, ...user } = (req as JWTRequest).auth
  const workflows = new Workflows()
  const { repo } = await workflows.status(config, { ...repoGit, ...user } as TGitOpts)

  if (!repo) throw new Error(`Requested repo does not exist`)

  return repo
}

