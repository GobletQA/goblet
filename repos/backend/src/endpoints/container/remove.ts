import type { Response } from 'express'
import type { TBEParamReq } from '@GBE/types'

import { AppRouter } from '@gobletqa/shared/api'
import { ForwardSubdomainHeader } from '@gobletqa/conductor'

export const remove = async (req:TBEParamReq, res:Response) => {
  const conductor = req.app.locals.conductor
  const userHash = (req.headers[ForwardSubdomainHeader] || ``).toString().split(`,`).shift()

  if(conductor.controller.devRouterActive)
    return res.status(200).json({})

  const refCont = conductor.controller.getContainer((req.params.containerRef || ``)?.trim())
  const container = refCont || conductor.controller.getContainer((res.locals.subdomain || ``)?.trim?.())

  if(!container)
    return res.status(422).json({})

  const status = await conductor.remove(container?.id, {
    userHash,
    throwOnEmpty: false,
    isContainerMap: false,
  })

  res.status(200).json(status || container)
}

AppRouter.post(`/container/remove/:containerRef`, remove)
