import type { Response, Request } from 'express'

import { apiRes } from '@gobletqa/shared/api/express/apiRes'
import { AppRouter } from '@gobletqa/shared/api/express/appRouter'

export const getRepo = async (req:Request, res:Response) => {
  return apiRes(res, { repo: res.locals.repo }, 200)
}

AppRouter.get(`/repo`, getRepo)