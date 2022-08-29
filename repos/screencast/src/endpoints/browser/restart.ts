import type { Response, Request } from 'express'

import { restartBrowser } from '@GSC/libs/playwright'
import { apiRes } from '@gobletqa/shared/express/apiRes'
import { asyncWrap } from '@gobletqa/shared/express/asyncWrap'
import { AppRouter } from '@gobletqa/shared/express/appRouter'
import { joinBrowserConf } from '@gobletqa/shared/utils/joinBrowserConf'

/**
 * Restarts a Browser by killing it, and starting it
 *
 */
const browserRestart = asyncWrap(async (req:Request, res:Response) => {
  const { params } = req
  const { status } = await restartBrowser(joinBrowserConf(params))

  return apiRes(res, status, 200)
})




AppRouter.post('/screencast/browser/restart', browserRestart)