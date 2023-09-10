import { Request, Response } from 'express'
import type { Conductor } from '@gobletqa/conductor/conductor'
import { AppRouter } from '@gobletqa/shared/api/express/appRouter'

export const inspect = async (req:Request, res:Response) => {
  const conductor = req.app.locals.conductor as Conductor
  const refCont = conductor.controller.getContainer((req.params.containerRef || ``)?.trim())
  const container = refCont || conductor.controller.getContainer((res.locals.subdomain)?.trim())
  const routes = conductor.controller.routes[res.locals.subdomain]

  res.status(200).json({ container, routes })
}

AppRouter.post(`/container/inspect/:containerRef`, inspect)

// Only load in a test environment
// process.env.NODE_ENV === `test` && 
AppRouter.get(`/container/inspect/:containerRef`, inspect)
