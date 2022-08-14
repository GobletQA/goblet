import type { Response, Request } from 'express'

import { asyncWrap, apiRes } from '@gobletqa/shared/express'
import { AppRouter } from '@gobletqa/shared/express/appRouter'
import { stopScreencast, startScreencast } from '@GSC/screencast'


/**
 * Endpoint to restart browser or start the browser if not running
 */
export const scRestart = asyncWrap(async (req:Request, res:Response) => {
  const { params } = req

  await stopScreencast()
  const status = await startScreencast(params)

  return apiRes(res, status, 200)
})


AppRouter.post('/screencast/restart', scRestart)