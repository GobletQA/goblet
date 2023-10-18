import type { EBrowserType } from '@GSC/types'
import type { Response, Request } from 'express'

import { GBrowser } from '@gobletqa/browser'
import { joinBrowserConf } from '@GSC/utils/joinBrowserConf'
import { apiRes } from '@gobletqa/shared/api/express/apiRes'
import { AppRouter } from '@gobletqa/shared/api/express/appRouter'

/**
 * Stops a Browser if its running
 *
 */
const browserStop = async (req:Request, res:Response) => {
  const { params } = req
  const { type } = joinBrowserConf(params)
  const status = await GBrowser.close(type as EBrowserType)

  return apiRes(res, status, 200)
}

AppRouter.post(`/screencast/browser/stop`, browserStop)
