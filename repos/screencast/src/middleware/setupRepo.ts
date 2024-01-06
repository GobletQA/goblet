import type { Response, NextFunction } from 'express'
import type { Request as JWTRequest } from 'express-jwt'

import { AppRouter } from '@gobletqa/shared/api'
import { loadRepoFromReq } from '@GSC/utils/loadRepoFromReq'


/**
 * Finds the currently active repo for the request
 * Then ensures it's loaded on the res.locals.repo property
 *
 */
const findRepo = async (req:JWTRequest, res:Response, next:NextFunction) => {
  // If loading a report, we don't need to check repo status
  // Just try to load the report if it exists, so skip loading the repo
  if (req.originalUrl.startsWith(`/repo/${req.params.repo}/reports/`))
    return next()

  const repo = await loadRepoFromReq(req)
  res.locals.repo = repo

  next()
}

/**
 * Middleware to set the repo for each request
 * Ensures the repo instance can be loaded before processes the request
 */
export const setupRepo = () => {
  AppRouter.use(`/repo/:repo/*`, findRepo)
}
