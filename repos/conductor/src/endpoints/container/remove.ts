import { AppRouter } from '@gobletqa/conductor/server/routers'
import { Request, Response } from 'express'


export const removeAll = async (req:Request, res:Response) => {
  const conductor = req.app.locals.conductor
  const status = await conductor.removeAll()
  res.status(200).json(status)
}

export const remove = async (req:Request, res:Response) => {
  const conductor = req.app.locals.conductor
  const refCont = conductor.controller.getContainer((req.params.containerRef || ``).trim())
  const container = refCont || conductor.controller.getContainer((res.locals.subdomain).trim())
  const status = await conductor.remove(container.Id)

  res.status(200).json(status)
}

AppRouter.post(`/container/remove-all`, removeAll)
AppRouter.post(`/container/remove/:containerRef`, remove)

// Only load in a test environment
process.env.NODE_ENV === `test`
  && AppRouter.get(`/container/remove-all`, removeAll)

// Only load in a test environment
process.env.NODE_ENV === `test`
  && AppRouter.get(`/container/remove/:containerRef`, remove)
