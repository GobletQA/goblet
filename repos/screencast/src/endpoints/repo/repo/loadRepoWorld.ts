import type { Response, Request } from 'express'

import { apiRes } from '@gobletqa/shared/api/express/apiRes'
import { AppRouter } from '@gobletqa/shared/api/express/appRouter'

/**
 * Loads the Parkin World object and passes it to the frontend
 */
export const loadRepoWorld = async (req:Request, res:Response) => {
  const world = res.locals.repo.refreshWorld()
  return apiRes(res, { world }, 200)
}

AppRouter.get(`/repo/world`, loadRepoWorld)