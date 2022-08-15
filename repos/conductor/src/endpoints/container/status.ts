import { Request, Response } from 'express'
import { asyncWrap, apiRes } from '@gobletqa/shared/express'
import { AppRouter } from '@gobletqa/conductor/server/routers'

/**
 * Gets the status of a connected repo
 * Calls the statusGoblet workflow
 */
export const statusContainer = asyncWrap(async (req:Request, res:Response) => {
  const conductor = req.app.locals.conductor
  const status = await conductor.status(req, res.locals.subdomain)

  return apiRes(res, status)
})



AppRouter.get(`/container/status/:imageRef`, statusContainer)