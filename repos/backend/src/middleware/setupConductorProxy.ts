import { asyncWrap } from '@gobletqa/shared/express'
import { ConductorService } from '@GBE/services/conductor'
import { AppRouter } from '@gobletqa/shared/express/appRouter'
import { Express, Request, Response, NextFunction } from 'express'

const conductorProxy = asyncWrap(async (req:Request, res:Response, next:NextFunction) => {
  const conductor = req.app.locals.conductor
  res.locals.conductorData = await conductor.forwardRequest(req, res)

  next()
})

export const setupConductorProxy = async (app:Express) => {
  const { conductor } = app?.locals?.config
  app.locals.conductor = app?.locals?.conductor || new ConductorService(conductor)

  await app.locals.conductor.validate()

  AppRouter.use(`/repo/:repo/*`, conductorProxy)
}
