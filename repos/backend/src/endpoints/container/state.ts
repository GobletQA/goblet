import { Response } from 'express'
import { apiRes } from '@gobletqa/shared/api/express/apiRes'
import type { Request as JWTRequest } from 'express-jwt'
import { AsyncRouter } from '@gobletqa/shared/api/express/appRouter'

/**
 * Gets the state of a connected repo
 * Calls the stateGoblet workflow
 */
export const stateContainer = async (req:JWTRequest, res:Response) => {
  const conductor = req.app.locals.conductor
  const imageRef = req?.params?.imageRef || Object.keys(conductor.config.images)[0]
  if(!imageRef) throw new Error(`Conductor config missing Image Reference`)

  // Does not includes the imageRef or ensure arguments
  // This way it only gets the status, and does not try to create the container
  const status = await conductor.status({
    query: { ...req?.query },
    body: { ...req?.body },
    params: { ...req?.params, imageRef },
  }, req?.auth?.subdomain || res?.locals?.subdomain)

  return apiRes(res, status)
}

AsyncRouter.get(`/container/state`, stateContainer)
AsyncRouter.get(`/container/state/:imageRef`, stateContainer)