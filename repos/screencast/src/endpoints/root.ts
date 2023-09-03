import type { Response, Request, RequestHandler } from 'express'

import { apiRes } from '@gobletqa/shared/api/express/apiRes'
import { AppRouter } from '@gobletqa/shared/api/express/appRouter'
import { asyncWrap } from '@gobletqa/shared/api/express/asyncWrap'

export const apiRoot:RequestHandler = asyncWrap(async (req:Request, res:Response) => {
  const config = req.app.locals.config

  return apiRes(
    res,
    {
      host: config.server.host,
      port: config.server.port,
    },
    200
  )
})

AppRouter.get('/', apiRoot)
