import type { Response, Request, RequestHandler } from 'express'
import type { Repo } from '@gobletqa/workflows'

import { GBrowser } from '@gobletqa/browser'
import { limbo } from '@keg-hub/jsutils/limbo'
import { loadRepoFromReq } from '@GSC/middleware/setupRepo'
import { joinBrowserConf } from '@GSC/utils/joinBrowserConf'
import { apiRes } from '@gobletqa/shared/api/express/apiRes'
import { AppRouter } from '@gobletqa/shared/api/express/appRouter'
import { asyncWrap } from '@gobletqa/shared/api/express/asyncWrap'

/**
 * Starts a Playwright Browser using the passed in params as launch options
 * @param {Object} req.params
 * @param {string} params.type - The browser type to start [chromium|firefox]
 *
 */
export const browserStart:RequestHandler = asyncWrap(async (req:Request, res:Response) => {
  const { query } = req

  const [__, config] = await limbo<Repo>(loadRepoFromReq(req))
  const { status } = await GBrowser.start({ config, browserConf: joinBrowserConf(query) })

  return apiRes(res, status, 200)
})

AppRouter.get('/screencast/browser/start', browserStart)