import type { Response, Request } from 'express'

import { apiRes, AppRouter } from '@gobletqa/shared/api'

export const getRepo = async (req:Request, res:Response) => {
  return apiRes(res, { repo: res.locals.repo }, 200)
}

AppRouter.get(`/repo`, getRepo)