import type { Repo } from '@gobletqa/workflows'
import type * as core from "express-serve-static-core"
import type { Response, Request, RequestHandler } from 'express'

import { GBrowser } from '@gobletqa/browser'
import { limbo } from '@keg-hub/jsutils/limbo'
import { apiRes } from '@gobletqa/shared/express/apiRes'
import { loadRepoFromReq } from '@GSC/middleware/setupRepo'
import { asyncWrap } from '@gobletqa/shared/express/asyncWrap'
import { AppRouter } from '@gobletqa/shared/express/appRouter'
import { joinBrowserConf } from '@gobletqa/shared/utils/joinBrowserConf'

type TStatusQuery = {
  slowMo:number
  timeout:number
  debug:boolean

  /**
   * TODO: Pretty sure width/height are **NOT** being used
   * If they should be used, then should be passed in via a `context: {...}` property
   */
  width:number
  height:number

  /**
   * May add these at some point
   */
  // headless?:boolean
  // tracesDir?:string
  // downloadsPath?:string

  /**
   * Would be possible to also add a `context: {...}` property
   * Which would be passed to the BrowserContext when it's created
   * Currently it's created right when the server starts
   * So the context would have to be recreated
   * Should also move the `width` and `height` to it
   */
  //  context: { width:number, height:number, ...other-context-properties }
}

/**
 * Gets the current status of the browser
 *
 */
export const browserStatus:RequestHandler = asyncWrap(async (
  req:Request<core.ParamsDictionary, any, any, TStatusQuery>,
  res:Response
) => {

  const [__, config] = await limbo<Repo>(loadRepoFromReq(req))

  const query = req.query as TStatusQuery
  const { status } = await GBrowser.start({ config, browserConf: joinBrowserConf(query)})

  return apiRes(res, status, 200)
})

AppRouter.get('/screencast/browser/status', browserStatus)