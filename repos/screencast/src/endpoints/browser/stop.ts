import type { EBrowserType } from '@gobletqa/shared/enums'
import type { Response, Request } from 'express'

import { GBrowser } from '@gobletqa/browser'
import { apiRes, AppRouter } from '@gobletqa/shared/api'
import { joinBrowserConf } from '@GSC/utils/joinBrowserConf'

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
