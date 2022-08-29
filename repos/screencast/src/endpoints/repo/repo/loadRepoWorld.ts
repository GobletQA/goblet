import type { Response, Request } from 'express'
import { apiRes } from '@gobletqa/shared/express/apiRes'
import { asyncWrap } from '@gobletqa/shared/express/asyncWrap'
import { AppRouter } from '@gobletqa/shared/express/appRouter'

/**
 * Loads the Parkin World object and passes it to the frontend
 */
export const loadRepoWorld = asyncWrap(async (req:Request, res:Response) => {
  const world = await res.locals.repo.refreshWorld()
  return apiRes(res, { world }, 200)
})

AppRouter.get('/repo/world', loadRepoWorld)