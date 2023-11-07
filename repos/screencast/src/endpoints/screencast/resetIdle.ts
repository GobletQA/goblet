import type { Response, Request } from 'express'

import { apiRes } from '@gobletqa/shared/api/express/apiRes'
import { AppRouter } from '@gobletqa/shared/api/express/appRouter'
import { resetConnectionCheck } from '@GSC/utils/resetConnectionCheck'

/**
 * Endpoint to get the current status  of the browser
 */
export const resetIdle = async (req:Request, res:Response) => {
  await resetConnectionCheck()
  return apiRes(res, {}, 200)
}

AppRouter.get(`/screencast/reset/idle`, resetIdle)
