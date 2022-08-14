import type { Response, Request } from 'express'
import { asyncWrap, apiRes } from '@gobletqa/shared/express'
import { AppRouter } from '@gobletqa/shared/express/appRouter'

export const getRepo = asyncWrap(async (req:Request, res:Response) => {
  return apiRes(res, { repo: res.locals.repo }, 200)
})

AppRouter.get('/repo', getRepo)