import type { Response, Request } from 'express'
import { apiRes } from '@gobletqa/shared/express/apiRes'
import { AppRouter } from '@gobletqa/shared/express/appRouter'
import { asyncWrap } from '@gobletqa/shared/express/asyncWrap'

export const apiRoot = asyncWrap(async (req:Request, res:Response) => {
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

