import type { Express } from 'express'

import { Conductor } from '@gobletqa/conductor'
import { AppRouter } from '@gobletqa/shared/api'


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
  AppRouter.use(/^\/repo\/(?!(all)).*/, apiProxy?.middleware)
  AppRouter.use('/screencast/*', apiProxy?.middleware)

  return {
    wsProxy,
    vncProxy,
    apiProxy,
    onUpgrade,
  }
}
