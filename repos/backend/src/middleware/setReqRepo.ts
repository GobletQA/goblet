import type { Express, Request, Response, NextFunction } from 'express'
import { getRepoGit } from '../utils/getRepoGit'
import { Repo } from '@gobletqa/shared/repo/repo'
import { asyncWrap } from '@gobletqa/shared/express'
import { AppRouter } from '@gobletqa/shared/express/appRouter'

/**
 * Finds the currently active repo for the request
 * Then ensures it's loaded on the res.locals.repo property
 *
 */
const findRepo = asyncWrap(async (req:Request, res:Response, next:NextFunction) => {
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
  const { iat, exp, ...user } = req.user
  const { repo } = await Repo.status(config, { ...repoGit, ...user })

  if (!repo) throw new Error(`Requested repo does not exist`)

  res.locals.repo = repo

  next()
})

/**
 * Middleware to set the repo for each request
 * Ensures the repo instance can be loaded before processes the request
 */
export const setReqRepo = (app:Express) => {
  AppRouter.use('/repo/:repo/*', findRepo)
}
