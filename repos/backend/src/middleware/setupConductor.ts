import type { Express } from 'express'
import { Conductor } from '@gobletqa/conductor'
import { AsyncRouter } from '@gobletqa/shared/express/appRouter'

export const setupConductor = async (app:Express) => {
  const { conductor } = app?.locals?.config
  app.locals.conductor = app?.locals?.conductor || new Conductor(conductor)

  await app.locals.conductor.validate()
  const proxies = app.locals.conductor.createProxy(app)
  // TODO: make this one use call instead of two
  AsyncRouter.use(/^\/repo\/(?!(all)).*/, proxies?.apiProxy)
  AsyncRouter.use('/iframe/*', proxies?.iframeProxy)
  AsyncRouter.use('/screencast/*', proxies?.apiProxy)

  return proxies
}
