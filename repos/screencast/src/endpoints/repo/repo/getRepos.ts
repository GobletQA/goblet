
import type { Response } from 'express'
import type { Request as JWTRequest } from 'express-jwt'
import type { TRepoGraphRepos } from '@gobletqa/shared/types'

import { Repo } from '@gobletqa/shared/repo/repo'
import { apiRes } from '@gobletqa/shared/express/apiRes'
import { asyncWrap } from '@gobletqa/shared/express/asyncWrap'
import { AppRouter } from '@gobletqa/shared/express/appRouter'

/**
 * Endpoint to get all repos from the authorized provider
 * Calls Repo.getUserRepos which calls the workflow getUserRepos method
 */
export const getRepos = asyncWrap(async (req:JWTRequest, res:Response) => {
  const { iat, exp, ...user } = req.auth
  const repos = await Repo.getUserRepos(user as TRepoGraphRepos)

  return apiRes(res, {repos}, 200)
})

AppRouter.get('/repo/all', getRepos)