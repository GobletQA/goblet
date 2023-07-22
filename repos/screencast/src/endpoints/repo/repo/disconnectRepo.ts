import type { Request, RequestHandler, Response } from 'express'

import { Repo } from '@gobletqa/workflows'
import { apiRes } from '@gobletqa/shared/express/apiRes'
import { asyncWrap } from '@gobletqa/shared/express/asyncWrap'
import { AppRouter } from '@gobletqa/shared/express/appRouter'

/**
 * Disconnects a connected repo
 */
export const disconnectRepo:RequestHandler = asyncWrap(async (req:Request, res:Response) => {
  const repo = await Repo.disconnect(req.body)
  return apiRes(res, { repo }, 200)
})

AppRouter.post('/repo/disconnect', disconnectRepo)