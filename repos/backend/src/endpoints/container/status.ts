import type { Response } from 'express'
import type { TBEDefReq } from '@GBE/types'

import { apiRes, AppRouter } from '@gobletqa/shared/api'


type TBEReqParams ={
  imageRef:string
}

/**
 * Gets the status of a connected repo
 * Calls the statusGoblet workflow
 */
export const statusContainer = async (req:TBEDefReq<TBEReqParams>, res:Response) => {
  const conductor = req.app.locals.conductor
  const imageRef = req?.params?.imageRef || Object.keys(conductor.config.images)[0]

  if(!imageRef) throw new Error(`Conductor config missing Image Reference`)

  const status = await conductor.status({
    query: { ...req?.query },
    body: { ...req?.body, ensure: true },
    params: { ...req?.params, imageRef },
  }, req?.auth?.subdomain || res?.locals?.subdomain)

  return apiRes(res, status)
}

AppRouter.get(`/container/status`, statusContainer)
AppRouter.get(`/container/status/:imageRef`, statusContainer)