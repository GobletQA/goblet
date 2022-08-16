import type { Conductor } from '../conductor'
import { asyncWrap } from '@gobletqa/shared/express'
import { getApp } from '@gobletqa/shared/express/app'
import { Express, Request, Response, NextFunction } from 'express'


const checkValidationHeader = asyncWrap(async (
  req:Request,
  res:Response,
  next:NextFunction
) => {

  const conductor = req.app.locals.conductor as Conductor
  if(!conductor) throw new Error(`Missing Conductor Instance`)

  /**
   * Should only be set to true in dev, defaults to false
   */
  if(conductor?.config?.localDevMode) return next()

  const { key, keyHeader } = conductor?.config?.server?.validation

  if(req.headers[keyHeader.toLowerCase()] === key) return next()

  throw new Error(`Request not authorized`)
})


export const setupValidationHeader = (app:Express) => {
  app = app || getApp()
  app.use(checkValidationHeader)
}