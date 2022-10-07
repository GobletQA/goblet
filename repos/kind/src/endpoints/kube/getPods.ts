import type { Kubectl } from '@GKD/Types'
import { Request, Response } from 'express'
import { apiRes } from '@gobletqa/shared/express/apiRes'
import { AsyncRouter } from '@gobletqa/shared/express/appRouter'

/**
 * **IMPORTANT** - Only repo endpoints that DO NOT interact with repo content are allowed in backend
 * All other repo endpoints must use the proxy to the session container 
 */

export const getPods = async (req:Request, res:Response) => {
  const kubectl = req.app.locals.kubectl as Kubectl
  const pods = await kubectl.getPods()
  
  return apiRes(res, { pods }, 200)
}

AsyncRouter.get(`/kube/pods`, getPods)


