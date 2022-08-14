import type { Response, Request } from 'express'

import { statusBrowser } from '@GSC/libs/playwright'
import { asyncWrap, apiRes } from '@gobletqa/shared/express'
import { AppRouter } from '@gobletqa/shared/express/appRouter'
import { joinBrowserConf } from '@gobletqa/shared/utils/joinBrowserConf'

/**
 * Gets the current status of the browser
 *
 */
export const browserStatus = asyncWrap(async (req:Request, res:Response) => {
  const { query } = req
  const { status } = await statusBrowser(joinBrowserConf(query))

  return apiRes(res, status, 200)
})

AppRouter.get('/screencast/browser/status', browserStatus)