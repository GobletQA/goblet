import type { Request, Response } from 'express'

import { workflows } from '@gobletqa/workflows'
import { apiRes, AppRouter } from '@gobletqa/shared/api'

/**
 * Disconnects a connected repo
 */
export const disconnectRepo = async (req:Request, res:Response) => {
  const repo = await workflows.disconnect(req.body)
  return apiRes(res, { repo }, 200)
}

AppRouter.post(`/repo/disconnect`, disconnectRepo)