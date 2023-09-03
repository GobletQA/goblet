import type { Express } from 'express'

import { Conductor } from '@gobletqa/conductor'
import { AsyncRouter } from '@gobletqa/shared/api/express/appRouter'


export const setupConductor = async (app:Express) => {

  const { conductor } = app?.locals?.config

  app.locals.conductor = app?.locals?.conductor
    || new Conductor(conductor)

  await app.locals.conductor.validate()

  const {
    wsProxy,
    vncProxy,
    apiProxy,
    onUpgrade,
  } = app.locals.conductor.createProxy(app)

  // TODO: make this one use call instead of two
  AsyncRouter.use(/^\/repo\/(?!(all)).*/, apiProxy?.middleware)
  AsyncRouter.use('/screencast/*', apiProxy?.middleware)

  return {
    wsProxy,
    vncProxy,
    apiProxy,
    onUpgrade,
  }
}
