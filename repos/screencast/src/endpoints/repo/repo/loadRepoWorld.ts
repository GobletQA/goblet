import type { Response, Request, RequestHandler } from 'express'
import { apiRes } from '@gobletqa/shared/api/express/apiRes'
import { asyncWrap } from '@gobletqa/shared/api/express/asyncWrap'
import { AppRouter } from '@gobletqa/shared/api/express/appRouter'

/**
 * Loads the Parkin World object and passes it to the frontend
 */
export const loadRepoWorld:RequestHandler = asyncWrap(async (req:Request, res:Response) => {
  const world = await res.locals.repo.refreshWorld()
  return apiRes(res, { world }, 200)
})

AppRouter.get('/repo/world', loadRepoWorld)