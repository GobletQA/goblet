import type { Response, Request } from 'express'

import { apiRes } from '@gobletqa/shared/express/apiRes'
import { asyncWrap } from '@gobletqa/shared/express/asyncWrap'
import { AppRouter } from '@gobletqa/shared/express/appRouter'
import { startBrowser } from '@GSC/libs/playwright/browser/browser'
import { joinBrowserConf } from '@gobletqa/shared/utils/joinBrowserConf'

/**
 * Gets the current status of the browser
 *
 */
export const browserStatus = asyncWrap(async (req:Request, res:Response) => {
  const { query } = req
  const { status } = await startBrowser(joinBrowserConf(query))

  return apiRes(res, status, 200)
})

AppRouter.get('/screencast/browser/status', browserStatus)