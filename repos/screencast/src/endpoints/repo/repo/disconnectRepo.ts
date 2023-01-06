import { Request, Response } from 'express'
import { Repo } from '@gobletqa/shared/repo/repo'
import { apiRes } from '@gobletqa/shared/express/apiRes'
import { asyncWrap } from '@gobletqa/shared/express/asyncWrap'
import { AppRouter } from '@gobletqa/shared/express/appRouter'

/**
 * Disconnects a connected repo
 */
export const disconnectRepo = asyncWrap(async (req:Request, res:Response) => {
  const repo = await Repo.disconnect(req.body)
  return apiRes(res, { repo }, 200)
})

AppRouter.post('/repo/disconnect', disconnectRepo)