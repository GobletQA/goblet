import type { Response } from 'express'
import type { Request as JWTRequest } from 'express-jwt'
import type { TRepoGraphRepos } from '@gobletqa/shared/types'

import { Workflows } from '@gobletqa/workflows'
import { apiRes } from '@gobletqa/shared/api/express/apiRes'
import { AppRouter } from '@gobletqa/shared/api/express/appRouter'

/**
 * Endpoint to get all repos from the authorized provider
 * Calls workflows.getUserRepos which calls the workflow getUserRepos method
 */
export const getRepos = async (req:JWTRequest, res:Response) => {
  const { iat, exp, ...user } = req.auth
  const workflows = new Workflows()
  const repos = await workflows.getUserRepos(user as TRepoGraphRepos)

  return apiRes(res, {repos}, 200)
}

AppRouter.get(`/repo/all`, getRepos)