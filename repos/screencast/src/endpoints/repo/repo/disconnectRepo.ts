import { Request, Response } from 'express'
import { Repo } from '@gobletqa/shared/repo/repo'
import { AppRouter } from '@gobletqa/shared/express/appRouter'
import { asyncWrap, apiRes } from '@gobletqa/shared/express'

/**
 * Disconnects a connected repo ( VNC mode only )
 */
export const disconnectRepo = asyncWrap(async (req:Request, res:Response) => {
  // TODO: Add req.body validation
  const repo = await Repo.disconnect(req.body)
  return apiRes(res, { repo }, 200)
})

AppRouter.post('/repo/disconnect', disconnectRepo)