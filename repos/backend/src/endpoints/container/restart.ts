
import type { Response } from 'express'
import type { TBEParamReq } from '@GBE/types'

import { AppRouter } from '@gobletqa/shared/api'
import { ForwardSubdomainHeader } from '@gobletqa/conductor'

export type TRestartReq = {
  imageRef?:string
  containerRef?:string
}

export const restart = async (req:TBEParamReq<TRestartReq>, res:Response) => {
  const conductor = req.app.locals.conductor

  if(conductor.controller.devRouterActive)
    return res.status(200).json({})

  const imageRef = req?.params?.imageRef || Object.keys(conductor.config.images)[0]
  if(!imageRef) throw new Error(`Conductor config missing Image Reference`)

  const userHash = (req.headers[ForwardSubdomainHeader] || ``).toString().split(`,`).shift()

  const refCont = conductor.controller.getContainer((req.params.containerRef || ``)?.trim())
  const container = refCont || conductor.controller.getContainer((res.locals.subdomain || ``)?.trim?.())

  const status = await conductor.restart({
    status: [{
      query: { ...req?.query },
      body: { ...req?.body, ensure: true },
      params: { ...req?.params, imageRef },
    }, userHash],
    remove: [container?.id, {
      userHash,
      throwOnEmpty: false,
      isContainerMap: false,
    }]
  })

  res.status(200).json(status)
}

AppRouter.post(`/container/restart/:containerRef`, restart)
