import type { Response, Request } from 'express'
import { apiRes } from '@gobletqa/shared/express/apiRes'
import { AsyncRouter } from '@gobletqa/shared/express/appRouter'

export const apiRoot = async (req:Request, res:Response) => {
  const config = req.app.locals.config

  return apiRes(
    res,
    {
      host: config.server.host,
      port: config.server.port,
    },
    200
  )
}

AsyncRouter.get('/', apiRoot)

