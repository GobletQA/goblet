import type { Request, RequestHandler, Response } from 'express'

import { apiRes } from '@gobletqa/shared/api/express/apiRes'
import { AppRouter } from '@gobletqa/shared/api/express/appRouter'
import { asyncWrap } from '@gobletqa/shared/api/express/asyncWrap'

/**
 * Responds with the parkin report html as string
 */
export const listReports:RequestHandler = asyncWrap(async (req:Request, res:Response) => {
  // TODO: add list of all current reports based on fileType
  return apiRes(res, { success: true } || {}, 200)
})


AppRouter.get('/repo/:repo/reports/:fileType/:fileName/list', listReports)