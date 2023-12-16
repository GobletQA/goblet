import type { Response, Request } from 'express'

import { loadFeatures } from '@gobletqa/shared/fs'
import { apiRes, AppRouter } from '@gobletqa/shared/api'

export const getFeatures = async (req:Request, res:Response) => {
  const features = await loadFeatures(res.locals.repo)

  return apiRes(res, features || [], 200)
}

AppRouter.get(`/repo/:repo/features`, getFeatures)