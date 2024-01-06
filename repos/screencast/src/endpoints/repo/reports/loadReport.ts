import type { Request, RequestHandler, Response } from 'express'

import { apiRes, AppRouter } from '@gobletqa/shared/api'

/**
 * Loads reports from the passed in params
 */
export const loadReport:RequestHandler = async (req:Request, res:Response) => {
  return apiRes(res, { success: true } || {}, 200)
}

AppRouter.get(`/repo/:repo/reports/*`, loadReport)
