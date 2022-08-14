import { asyncWrap, apiRes } from '@gobletqa/shared/express'
import { AppRouter } from '@gobletqa/shared/express/appRouter'

export const apiRoot = asyncWrap(async (req, res) => {
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
