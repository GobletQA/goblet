import type { Repo } from '@gobletqa/repo'
import type { Response, Request } from 'express'

import { GBrowser } from '@gobletqa/browser'
import { limbo } from '@keg-hub/jsutils/limbo'
import { apiRes, AppRouter } from '@gobletqa/shared/api'
import { loadRepoFromReq } from '@GSC/utils/loadRepoFromReq'
import { joinBrowserConf } from '@GSC/utils/joinBrowserConf'


/**
 * Starts a Playwright Browser using the passed in params as launch options
 * @param {Object} req.params
 * @param {string} params.type - The browser type to start [chromium|firefox]
 *
 */
export const browserStart = async (req:Request, res:Response) => {
  const { query } = req

  const [__, config] = await limbo<Repo>(loadRepoFromReq(req))
  const { status } = await GBrowser.start({ config, browserConf: joinBrowserConf(query) })

  return apiRes(res, status, 200)
}

AppRouter.get(`/screencast/browser/start`, browserStart)