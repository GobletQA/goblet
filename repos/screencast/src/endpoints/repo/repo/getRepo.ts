import type { Response, Request, RequestHandler } from 'express'
import { apiRes } from '@gobletqa/shared/express/apiRes'
import { asyncWrap } from '@gobletqa/shared/express/asyncWrap'
import { AppRouter } from '@gobletqa/shared/express/appRouter'

export const getRepo:RequestHandler = asyncWrap(async (req:Request, res:Response) => {
  return apiRes(res, { repo: res.locals.repo }, 200)
})

AppRouter.get('/repo', getRepo)