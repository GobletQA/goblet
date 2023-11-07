import type { TBEParamReq } from '@GBE/types'
import { Response } from 'express'
import { AppRouter } from '@gobletqa/shared/api/express/appRouter'

type TReq = {
  containerRef:string
}

export const inspect = async (req:TBEParamReq<TReq>, res:Response) => {
  const conductor = req.app.locals.conductor
  const refCont = conductor.controller.getContainer((req.params.containerRef || ``)?.trim())
  const container = refCont || conductor.controller.getContainer((res.locals.subdomain)?.trim())
  const routes = conductor.controller.routes[res.locals.subdomain]

  res.status(200).json({ container, routes })
}

AppRouter.post(`/container/inspect/:containerRef`, inspect)

// Only load in a test environment
// process.env.NODE_ENV === `test` && 
AppRouter.get(`/container/inspect/:containerRef`, inspect)
