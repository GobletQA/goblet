import { Request, Response } from 'express'
import { AsyncRouter } from '@gobletqa/shared/express/appRouter'


export const remove = async (req:Request, res:Response) => {
  const conductor = req.app.locals.conductor
  const refCont = conductor.controller.getContainer((req.params.containerRef || ``)?.trim())

  const container = refCont || conductor.controller.getContainer((res.locals.subdomain || ``)?.trim?.())

  if(!container)
    throw new Error(`Container not found for ${req.params.containerRef || res.locals.subdomain}`) 

  const status = await conductor.remove(container?.id, false, false)

  res.status(200).json(status || container)
}

AsyncRouter.post(`/container/remove/:containerRef`, remove)
