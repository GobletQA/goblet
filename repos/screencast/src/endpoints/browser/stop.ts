import type { Response, Request } from 'express'

import { stopBrowser } from '@GSC/libs/playwright'
import { asyncWrap, apiRes } from '@gobletqa/shared/express'
import { AppRouter } from '@gobletqa/shared/express/appRouter'
import { joinBrowserConf } from '@gobletqa/shared/utils/joinBrowserConf'

/**
 * Stops a Browser if its running
 *
 */
const browserStop = asyncWrap(async (req:Request, res:Response) => {
  const { params } = req
  const status = await stopBrowser(joinBrowserConf(params))

  return apiRes(res, status, 200)
})

AppRouter.post('/screencast/browser/stop', browserStop)