import { Request, Response } from 'express'
import { apiRes } from '@gobletqa/shared/express'
import { AsyncRouter } from '@gobletqa/shared/express/appRouter'

/**
 * Gets the status of a connected repo
 * Calls the statusGoblet workflow
 */
export const statusContainer = async (req:Request, res:Response) => {
  const conductor = req.app.locals.conductor
  const imageRef = req?.params?.imageRef || Object.keys(conductor.config.images).shift()

  const status = await conductor.status({
    query: { ...req?.query },
    body: { ...req?.body, ensure: true },
    params: { ...req?.params, imageRef },
  }, req?.user?.subdomain)

  return apiRes(res, status)
}

AsyncRouter.get(`/container/status`, statusContainer)
AsyncRouter.get(`/container/status/:imageRef`, statusContainer)