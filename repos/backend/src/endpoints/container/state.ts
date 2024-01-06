import type { Response } from 'express'
import type { TBEDefReq } from '@GBE/types'

import { apiRes, AppRouter } from '@gobletqa/shared/api'


type TBEReqParams ={
  imageRef:string
}

/**
 * Gets the state of a connected repo
 * Calls the stateGoblet workflow
 */
export const stateContainer = async (req:TBEDefReq<TBEReqParams>, res:Response) => {
  const conductor = req.app.locals.conductor
  const imageRef = req?.params?.imageRef || Object.keys(conductor.config.images)[0]
  if(!imageRef) throw new Error(`Conductor config missing Image Reference`)

  // Does not includes the imageRef or ensure arguments
  // This way it only gets the status, and does not try to create the container
  const status = await conductor.status({
    query: { ...req?.query },
    body: { ...req?.body },
    params: { ...req?.params, imageRef },
  }, req?.auth?.subdomain || res?.locals?.subdomain)

  // TODO: update here to make an API call to session container
  // To ensure its running

  return apiRes(res, status)
}

AppRouter.get(`/container/state`, stateContainer)
AppRouter.get(`/container/state/:imageRef`, stateContainer)