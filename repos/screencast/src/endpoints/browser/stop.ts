import type { Response, Request, RequestHandler } from 'express'

import { closeBrowser } from '@GSC/libs/playwright/browser/browser'
import { apiRes } from '@gobletqa/shared/express/apiRes'
import { asyncWrap } from '@gobletqa/shared/express/asyncWrap'
import { AppRouter } from '@gobletqa/shared/express/appRouter'
import { joinBrowserConf } from '@gobletqa/shared/utils/joinBrowserConf'

/**
 * Stops a Browser if its running
 *
 */
const browserStop:RequestHandler = asyncWrap(async (req:Request, res:Response) => {
  const { params } = req
  const { type } = joinBrowserConf(params)
  const status = await closeBrowser(type)

  return apiRes(res, status, 200)
})

AppRouter.post('/screencast/browser/stop', browserStop)