import type { Response, Request } from 'express'

import { apiRes } from '@gobletqa/shared/express/apiRes'
import { asyncWrap } from '@gobletqa/shared/express/asyncWrap'
import { AppRouter } from '@gobletqa/shared/express/appRouter'
import { joinBrowserConf } from '@gobletqa/shared/utils/joinBrowserConf'
import { startBrowser, closeBrowser } from '@GSC/libs/playwright/browser/browser'

/**
 * Restarts a Browser by killing it, and starting it
 *
 */
const browserRestart = asyncWrap(async (req:Request, res:Response) => {
  const { params } = req
  const browserConf = joinBrowserConf(params)
  await closeBrowser(browserConf.type)
  const { status } = await startBrowser(browserConf)

  return apiRes(res, status, 200)
})

AppRouter.post('/screencast/browser/restart', browserRestart)