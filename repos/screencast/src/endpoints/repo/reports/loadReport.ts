import { Request, RequestHandler, Response } from 'express'
import { apiRes } from '@gobletqa/shared/api/express/apiRes'
import { AppRouter } from '@gobletqa/shared/api/express/appRouter'

/**
 * Loads reports from the passed in params
 */
export const loadReport:RequestHandler = async (req:Request, res:Response) => {
  return apiRes(res, { success: true } || {}, 200)
}

AppRouter.get(`/repo/:repo/reports/*`, loadReport)
