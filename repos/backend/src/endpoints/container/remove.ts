import { Request, Response } from 'express'
import { AppRouter } from '@gobletqa/shared/api/express/appRouter'


export const remove = async (req:Request, res:Response) => {
  const conductor = req.app.locals.conductor

  if(conductor.controller.devRouterActive)
    return res.status(200).json({})

  const refCont = conductor.controller.getContainer((req.params.containerRef || ``)?.trim())

  const container = refCont || conductor.controller.getContainer((res.locals.subdomain || ``)?.trim?.())

  if(!container)
    throw new Error(`Container not found for ${req.params.containerRef || res.locals.subdomain}`) 

  const status = await conductor.remove(container?.id, false, false)

  res.status(200).json(status || container)
}

AppRouter.post(`/container/remove/:containerRef`, remove)
