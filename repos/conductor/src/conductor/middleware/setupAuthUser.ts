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

const validateUser = asyncWrap((
  req:Request,
  res:Response,
  next:NextFunction
) => {

  const conductor = req.app.locals.conductor as Conductor
  if(!conductor) throw new Error(`Missing Conductor Instance`)

  const hashKey = conductor?.config?.proxy?.hashKey

  /**
   * Should only be set to true in dev, defaults to false
   */
  if(conductor?.config?.localDevMode){
    // TODO: come up with better values for this
     const decoded = {
      userId: `12345`,
      token: `gh-12345`,
      provider: `github`,
      username: `lancetipton`,
    }
    res.locals.user = decoded
    res.locals.subdomain = hashString(`${decoded.username}-${hashKey}`)

    return next()
  }

  if (AUTH_BYPASS_ROUTES.includes(req.originalUrl)) return next()

  const decoded = decodeToken(
    req.headers.authorization,
    conductor.config?.server?.jwt?.secret,
  )

  if(!decoded) throw new Error(`Request not authorized, invalid Auth-Token`)

  res.locals.user = decoded
  res.locals.subdomain = hashString(`${decoded.username}-${hashKey}`)

  return next()
})

export const setupAuthUser = (app:Express) => {
  app = app || getApp() as Express

  app.use(validateUser)
}
