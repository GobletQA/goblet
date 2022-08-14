import type { Response, Request } from 'express'

import { startScreencast } from '@GSC/screencast'
import { asyncWrap, apiRes } from '@gobletqa/shared/express'
import { AppRouter } from '@gobletqa/shared/express/appRouter'


/**
 * Endpoint to start browser if it's not running
 */
const scStart = asyncWrap(async (req:Request, res:Response) => {
  const { params } = req
  const status = await startScreencast(params)

  return apiRes(res, status, 200)
})


AppRouter.post('/screencast/start', scStart)