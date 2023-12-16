import type { Response, Request } from 'express'

import { apiRes, AppRouter } from '@gobletqa/shared/api'
import { resetConnectionCheck } from '@GSC/utils/resetConnectionCheck'

/**
 * Endpoint to get the current status  of the browser
 */
export const resetIdle = async (req:Request, res:Response) => {
  await resetConnectionCheck()
  return apiRes(res, {}, 200)
}

AppRouter.get(`/screencast/reset/idle`, resetIdle)
