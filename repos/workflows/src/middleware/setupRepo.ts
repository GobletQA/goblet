import type { TGitOpts } from '@GWF/types'
import type { Request as JWTRequest } from 'express-jwt'
import type { Express, Response, NextFunction } from 'express'

import { Repo } from '@GWF/repo/repo'
import { asyncWrap } from '@gobletqa/shared/express'
import { pickKeys, deepMerge } from '@keg-hub/jsutils'
import { TWFGobletConfig } from '@gobletqa/workflows/types'
import { AppRouter } from '@gobletqa/shared/express/appRouter'

/**
 * Gets the git keys off the request for all request types
 */
export const getRepoGit = ({ query, params, body }:JWTRequest) => {
  return pickKeys(deepMerge(params, query, body), [
    `path`,
    `local`,
    `remote`,
    `branch`,
  ])
}


export const loadRepoFromReq = async (
  req:JWTRequest,
) => {
  const config:TWFGobletConfig = req.app.locals.config
  const repoGit = getRepoGit(req)

  if (!repoGit || !repoGit.local)
    throw new Error(`Endpoint requires a locally mounted path, I.E. /repos/:repo-name/*`)

  const { iat, exp, ...user } = req.auth
  const { repo } = await Repo.status(config, { ...repoGit, ...user } as TGitOpts)

  if (!repo) throw new Error(`Requested repo does not exist`)

  return repo
}

/**
 * Finds the currently active repo for the request
 * Then ensures it's loaded on the res.locals.repo property
 *
 */
const findRepo = asyncWrap(async (req:JWTRequest, res:Response, next:NextFunction) => {
  // If loading a report, we don't need to check repo status
  // Just try to load the report if it exists, so skip loading the repo
  if (req.originalUrl.startsWith(`/repo/${req.params.repo}/reports/`))
    return next()

  const repo = await loadRepoFromReq(req)
  res.locals.repo = repo

  next()
})

/**
 * Middleware to set the repo for each request
 * Ensures the repo instance can be loaded before processes the request
 */
export const setupRepo = (app:Express) => {
  AppRouter.use('/repo/:repo/*', findRepo)
}
