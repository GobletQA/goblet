import type { Response } from 'express'
import type { Request as JWTRequest } from 'express-jwt'
import type { TRepoGraphRepos } from '@gobletqa/shared/types'

import { workflows } from '@gobletqa/workflows'
import { apiRes, AppRouter } from '@gobletqa/shared/api'

/**
 * Endpoint to get all repos from the authorized provider
 * Calls workflows.getUserRepos which calls the workflow getUserRepos method
 */
export const getRepos = async (req:JWTRequest, res:Response) => {
  const { iat, exp, ...user } = req.auth
  const repos = await workflows.getUserRepos(user as TRepoGraphRepos)

  return apiRes(res, {repos}, 200)
}

AppRouter.get(`/repo/all`, getRepos)