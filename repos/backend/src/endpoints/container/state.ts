import { Request, Response } from 'express'
import { apiRes } from '@gobletqa/shared/express'
import { AsyncRouter } from '@gobletqa/shared/express/appRouter'

/**
 * Gets the state of a connected repo
 * Calls the stateGoblet workflow
 */
export const stateContainer = async (req:Request, res:Response) => {
  const conductor = req.app.locals.conductor

  // Does not includes the imageRef or ensure arguments
  // This way it only gets the status, and does not try to create the container
  const status = await conductor.status({
    query: { ...req?.query },
    body: { ...req?.body },
    params: { ...req?.params },
  }, req?.user?.subdomain)

  return apiRes(res, status)
}

AsyncRouter.get(`/container/state`, stateContainer)
AsyncRouter.get(`/container/state/:imageRef`, stateContainer)