import { Request, Response } from 'express'
import { apiRes } from '@gobletqa/shared/express/apiRes'
import { AsyncRouter } from '@gobletqa/shared/express/appRouter'

/**
 * **IMPORTANT** - Only repo endpoints that DO NOT interact with repo content are allowed in backend
 * All other repo endpoints must use the proxy to the session container 
 */

export const kube = async (req:Request, res:Response) => {


  return apiRes(res, { kube: `You have kube-ctl` }, 200)
}

AsyncRouter.get(`/kube`, kube)


