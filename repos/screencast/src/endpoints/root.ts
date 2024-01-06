import type { Response, Request } from 'express'

import { apiRes, AppRouter } from '@gobletqa/shared/api'

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

AppRouter.get(`/`, apiRoot)
