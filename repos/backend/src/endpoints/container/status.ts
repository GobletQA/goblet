import { Request, Response } from 'express'
import { asyncWrap, apiRes } from '@gobletqa/shared/express'
import { AsyncRouter } from '@gobletqa/shared/express/appRouter'

/**
 * Gets the status of a connected repo
 * Calls the statusGoblet workflow
 */
export const statusContainer = async (req:Request, res:Response) => {
  const conductor = req.app.locals.conductor
  const status = await conductor.status(req, res.locals.subdomain)

  return apiRes(res, status)
}

AsyncRouter.get(`/container/status/:imageRef`, statusContainer)