import type { Response, Request } from 'express'
import { asyncWrap, apiRes } from '@gobletqa/shared/express'
import { AppRouter } from '@gobletqa/shared/express/appRouter'
import { loadFeatures } from '@gobletqa/shared/libs/features/features'

export const getFeatures = asyncWrap(async (req:Request, res:Response) => {
  const features = await loadFeatures(res.locals.repo)

  return apiRes(res, features || [], 200)
})

AppRouter.get('/repo/:repo/features', getFeatures)