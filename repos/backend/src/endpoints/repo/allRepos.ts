import { Request, Response } from 'express'
import { getUserRepos } from '@gobletqa/workflows'
import { apiRes } from '@gobletqa/shared/express'
import { AsyncRouter } from '@gobletqa/shared/express/appRouter'

/**
 * **IMPORTANT** - Only repo endpoints that DO NOT interact with repo content are allowed in backend
 * All other repo endpoints must use the proxy to the session container 
 */

export const allRepos = async (req:Request, res:Response) => {
  // While the container is spinning up
  // Get the users repos from the git provider
  // Does not need to be from the container
  const { iat, exp, ...user } = req.user
  const repos = await getUserRepos(user)

  return apiRes(res, {repos}, 200)
}

AsyncRouter.get(`/repo/all`, allRepos)
