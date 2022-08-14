import type { Response, Request } from 'express'

import { stopScreencast } from '@GSC/screencast'
import { asyncWrap, apiRes } from '@gobletqa/shared/express'
import { AppRouter } from '@gobletqa/shared/express/appRouter'

/**
 * Endpoint to stop browser if it's running
 */
export const scStop = asyncWrap(async (req:Request, res:Response) => {
  await stopScreencast()

  return apiRes(res, {}, 200)
})


AppRouter.post('/screencast/stop', scStop)