import { Request, Response } from 'express'
import { AsyncRouter } from '@gobletqa/shared/express/appRouter'


export const removeAll = async (req:Request, res:Response) => {
  const conductor = req.app.locals.conductor
  const status = await conductor.removeAll()
  res.status(200).json(status)
}

export const remove = async (req:Request, res:Response) => {
  const conductor = req.app.locals.conductor
  const refCont = conductor.controller.getContainer((req.params.containerRef || ``)?.trim())

  const container = refCont || conductor.controller.getContainer((res.locals.subdomain || ``)?.trim?.())

  if(!container)
    throw new Error(`Container not found for ${req.params.containerRef || res.locals.subdomain}`) 

  const status = await conductor.remove(container?.id)

  res.status(200).json(status)
}

AsyncRouter.post(`/container/remove-all`, removeAll)
AsyncRouter.post(`/container/remove/:containerRef`, remove)

// Only load in a test environment
// process.env.NODE_ENV === `test`
//   && 
  AsyncRouter.get(`/container/remove-all`, removeAll)

// Only load in a test environment
// process.env.NODE_ENV === `test`
//   && 
AsyncRouter.get(`/container/remove/:containerRef`, remove)
