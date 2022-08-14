import type { Response, Request } from 'express'

import { Repo } from '@gobletqa/shared/repo/repo'
import { asyncWrap, apiRes } from '@gobletqa/shared/express'
import { AppRouter } from '@gobletqa/shared/express/appRouter'

/**
 * Endpoint to get all repos from the authorized provider
 * Calls Repo.getUserRepos which calls the workflow getUserRepos method
 */
export const getRepos = asyncWrap(async (req:Request, res:Response) => {
  // @ts-ignore
  const { iat, exp, ...user } = req.user
  const repos = await Repo.getUserRepos(user)

  return apiRes(res, {repos}, 200)
})

AppRouter.get('/repo/all', getRepos)