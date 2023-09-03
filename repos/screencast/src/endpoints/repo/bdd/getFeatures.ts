import type { Response, Request, RequestHandler } from 'express'
import { apiRes } from '@gobletqa/shared/api/express/apiRes'
import { asyncWrap } from '@gobletqa/shared/api/express/asyncWrap'
import { AppRouter } from '@gobletqa/shared/api/express/appRouter'
import { loadFeatures } from '@gobletqa/shared/libs/features/features'

export const getFeatures:RequestHandler = asyncWrap(async (req:Request, res:Response) => {
  const features = await loadFeatures(res.locals.repo)

  return apiRes(res, features || [], 200)
})

AppRouter.get('/repo/:repo/features', getFeatures)