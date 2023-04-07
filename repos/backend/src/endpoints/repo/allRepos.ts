import type { Response } from 'express'
import type { Request as JWTRequest } from 'express-jwt'

import { GithubGraphApi } from '@gobletqa/workflows'
import { apiRes } from '@gobletqa/shared/express/apiRes'
import { AsyncRouter } from '@gobletqa/shared/express/appRouter'

/**
 * **IMPORTANT** - Only repo endpoints that DO NOT interact with repo content are allowed in backend
 * All other repo endpoints must use the proxy to the session container 
 */

export const allRepos = async (req:JWTRequest, res:Response) => {
  const graphApi = new GithubGraphApi()
  // While the container is spinning up
  // Get the users repos from the git provider
  // Does not need to be from the container
  const { iat, exp, ...user } = req.auth
  const repos = await graphApi.userRepos(user)

  return apiRes(res, {repos}, 200)
}

AsyncRouter.get(`/repo/all`, allRepos)
