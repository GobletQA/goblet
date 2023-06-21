import type { Request as JWTRequest } from 'express-jwt'
import type { Express, Response, NextFunction } from 'express'

import { Repo } from '@GSH/repo/repo'
import { asyncWrap } from '@GSH/express'
import { AppRouter } from '@GSH/express/appRouter'
import { pickKeys, deepMerge } from '@keg-hub/jsutils'

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

  const config = req.app.locals.config
  const repoGit = getRepoGit(req)

  if (!repoGit || !repoGit.local)
    throw new Error(
      `Endpoint requires a locally mounted path, I.E. /repo/:repo-name/*`
    )

  // @ts-ignore
  const { iat, exp, ...user } = req.auth
  const { repo } = await Repo.status(config, { ...repoGit, ...user })

  if (!repo) throw new Error(`Requested repo does not exist`)

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
