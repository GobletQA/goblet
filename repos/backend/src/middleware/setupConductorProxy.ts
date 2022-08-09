import { asyncWrap } from '@gobletqa/shared/express'
import { Express, Request, Response, NextFunction } from 'express'

const { Repo } = require('@gobletqa/shared/repo/repo')
const { AppRouter } = require('@gobletqa/shared/express/appRouter')

const conductorProxy = asyncWrap(async (req:Request, res:Response, next:NextFunction) => {
  // TODO: configure conductor proxy here
  next()
})

export const setupConductorProxy = (app:Express) => {
  AppRouter.use(`/repo/:repo/*`, conductorProxy)
}

