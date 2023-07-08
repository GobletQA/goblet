import type { Response, Request, RequestHandler } from 'express'

import { apiRes } from '@gobletqa/shared/express/apiRes'
import { asyncWrap } from '@gobletqa/shared/express/asyncWrap'
import { AppRouter } from '@gobletqa/shared/express/appRouter'
import { startBrowser } from '@GSC/libs/playwright/browser/browser'
import { joinBrowserConf } from '@gobletqa/shared/utils/joinBrowserConf'

/**
 * Starts a Playwright Browser using the passed in params as launch options
 * @param {Object} req.params
 * @param {string} params.type - The browser type to start [chromium|firefox]
 *
 */
export const browserStart:RequestHandler = asyncWrap(async (req:Request, res:Response) => {
  const { query } = req
  const { status } = await startBrowser({ browserConf: joinBrowserConf(query) })

  return apiRes(res, status, 200)
})

AppRouter.get('/screencast/browser/start', browserStart)