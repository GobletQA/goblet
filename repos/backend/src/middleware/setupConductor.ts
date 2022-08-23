import type { Express } from 'express'
import { Conductor } from '@gobletqa/conductor'
import { AsyncRouter } from '@gobletqa/shared/express/appRouter'

export const setupConductor = async (app:Express) => {
  const { conductor } = app?.locals?.config
  app.locals.conductor = app?.locals?.conductor || new Conductor(conductor)

  await app.locals.conductor.validate()
  const proxy = app.locals.conductor.createProxy()
  // TODO: make this one use call instead of two
  AsyncRouter.use(/^\/repo\/(?!(all)).*/, proxy)
  AsyncRouter.use('/screencast/*', proxy)
}
