import { Response } from 'express'
import type { Request as JWTRequest } from 'express-jwt'
import { apiRes } from '@gobletqa/shared/api/express/apiRes'
import { AsyncRouter } from '@gobletqa/shared/api/express/appRouter'

/**
 * Gets the status of a connected repo
 * Calls the statusGoblet workflow
 */
export const statusContainer = async (req:JWTRequest, res:Response) => {
  const conductor = req.app.locals.conductor
  const imageRef = req?.params?.imageRef || Object.keys(conductor.config.images)[0]

  if(!imageRef) throw new Error(`Conductor config missing Image Reference`)

  const status = await conductor.status({
    query: { ...req?.query },
    body: { ...req?.body, ensure: true },
    params: { ...req?.params, imageRef },
  }, req?.auth?.subdomain || res?.locals?.subdomain)

  return apiRes(res, status)
}

AsyncRouter.get(`/container/status`, statusContainer)
AsyncRouter.get(`/container/status/:imageRef`, statusContainer)