import { asyncWrap } from '@gobletqa/shared/express'
import { ConductorService } from '@GBE/Conductor/conductor'
import { AppRouter } from '@gobletqa/shared/express/appRouter'
import { Express, Request, Response, NextFunction } from 'express'

const conductorProxy = asyncWrap(async (req:Request, res:Response, next:NextFunction) => {
  const conductor = req.app.locals.conductor
  res.locals.conductorData = await conductor.forwardRequest(req, res)

  next()
})

export const setupConductorProxy = (app:Express) => {
  app.locals.conductor = app.locals.conductor || new ConductorService(app.locals.config.conductor)
  AppRouter.use(`/repo/:repo/*`, conductorProxy)
}

