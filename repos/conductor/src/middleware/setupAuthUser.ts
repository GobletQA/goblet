import { hashString } from '@keg-hub/jsutils'
import type { Conductor } from '../conductor'
import { AUTH_BYPASS_ROUTES } from '../constants'
import { asyncWrap } from '@gobletqa/shared/express'
import { getApp } from '@gobletqa/shared/express/app'
import { Express, Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const decodeToken = (authHeader:string, secret:string) => {
  return jwt.verify(authHeader.split(`Bearer `).pop(), secret)
}

const validateUser = asyncWrap((req:Request, res:Response, next:NextFunction) => {
  if (AUTH_BYPASS_ROUTES.includes(req.originalUrl)) return next()
  
  const conductor = req.app.locals.conductor as Conductor
  if(!conductor) throw new Error(`Missing Conductor Instance`)

  const hashKey = conductor?.config?.proxy?.hashKey
  
  const decoded = decodeToken(
    req.headers.authorization,
    conductor.config?.server?.jwt?.secret,
  )

  if(!decoded) throw new Error(`Request not authorized, invalid Auth-Token`)

  const user = decoded
  res.locals.user = user
  res.locals.subdomain = hashString(`${user.username}-${hashKey}`)

  next()
})

export const setupAuthUser = (app:Express) => {
  app = app || getApp() as Express

  app.use(validateUser)
}
