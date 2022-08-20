import { Conductor } from '@gobletqa/conductor'
import { asyncWrap } from '@gobletqa/shared/express'
import { AppRouter } from '@gobletqa/shared/express/appRouter'
import { Express, Request, Response, NextFunction } from 'express'

const conductorProxy = asyncWrap(async (req:Request, res:Response, next:NextFunction) => {
  !req.originalUrl.startsWith(`/repo`)
    ? next()
    : await req.app.locals.conductor.proxyRequest(req, res)
})


export const setupConductor = async (app:Express) => {
  const { conductor } = app?.locals?.config
  app.locals.conductor = app?.locals?.conductor || new Conductor()

  await app.locals.conductor.validate()

  AppRouter.use(`/repo/*`, conductorProxy)
}

