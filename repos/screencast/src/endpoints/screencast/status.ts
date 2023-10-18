import type { TBrowserConf } from '@GSC/types'
import type { Response, Request } from 'express'

import { parseJSON } from '@keg-hub/jsutils/parseJSON'
import { statusScreencast } from '@GSC/utils/statusScreencast'
import { apiRes } from '@gobletqa/shared/api/express/apiRes'
import { AppRouter } from '@gobletqa/shared/api/express/appRouter'

export type TStatusSCParams = {
  browser?:TBrowserConf|string
}

/**
 * Endpoint to get the current status  of the browser
 */
export const scStatus = async (req:Request, res:Response) => {
  const query = req.query as TStatusSCParams

  const status = await statusScreencast({
    ...query,
    // @ts-ignore
    ...(query.browser && { browser: parseJSON(query.browser, false) }),
  })
  status.lastCheck = new Date().getTime()

  return apiRes(res, status, 200)
}

AppRouter.get(`/screencast/status`, scStatus)
