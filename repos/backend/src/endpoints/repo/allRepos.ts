import type { Response } from 'express'
import type { Request as JWTRequest } from 'express-jwt'
import type { TRepoGraphRepos } from '@GBE/types'

import { Repo } from '@gobletqa/workflows'
import { apiRes } from '@gobletqa/shared/express/apiRes'
import { AsyncRouter } from '@gobletqa/shared/express/appRouter'

/**
 * **IMPORTANT** - Only repo endpoints that DO NOT interact with repo content are allowed in backend
 * All other repo endpoints must use the proxy to the session container 
 */

export const allRepos = async (req:JWTRequest, res:Response) => {
  // While the container is spinning up
  // Get the users repos from the git provider
  // Does not need to be from the container
  const { iat, exp, ...opts } = req.auth
  const repos = await Repo.getUserRepos(opts as TRepoGraphRepos)

  return apiRes(res, {repos}, 200)
}

AsyncRouter.get(`/repo/all`, allRepos)
