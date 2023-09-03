import type { Response, Request, RequestHandler } from 'express'
import { apiRes } from '@gobletqa/shared/api/express/apiRes'
import { asyncWrap } from '@gobletqa/shared/api/express/asyncWrap'
import { AppRouter } from '@gobletqa/shared/api/express/appRouter'

export const getRepo:RequestHandler = asyncWrap(async (req:Request, res:Response) => {
  return apiRes(res, { repo: res.locals.repo }, 200)
})

AppRouter.get('/repo', getRepo)