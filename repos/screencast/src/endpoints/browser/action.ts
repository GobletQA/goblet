import type { Repo } from '@gobletqa/repo'
import type { RequestHandler, Response } from 'express'
import type { Request as JWTRequest } from 'express-jwt'

import { limbo } from '@keg-hub/jsutils/limbo'
import { noOpObj } from '@keg-hub/jsutils/noOpObj'
import { loadRepoFromReq } from '@GSC/utils/loadRepoFromReq'
import { joinBrowserConf } from '@GSC/utils/joinBrowserConf'
import { apiRes } from '@gobletqa/shared/api/express/apiRes'
import { AppRouter } from '@gobletqa/shared/api/express/appRouter'
import {
  GBrowser,
  actionBrowser,
  setBrowserDefaults,
} from '@gobletqa/browser'

/**
 * Execute an action on a playwright component ( browser, context, page )
 *
 */
const browserAction:RequestHandler = async (req:JWTRequest, res:Response) => {
  const { body } = req
  const {
    ref,
    actions,
    repo:repoBody,
    ...browser
  } = body

  req.body = repoBody
  const [__, repo] = await limbo<Repo>(loadRepoFromReq(req))
  const browserConf = joinBrowserConf(browser)

  const pwComponents = await GBrowser.get({
    browserConf,
    config:repo,
  })

  const resp:Record<any, any> = {}
  try {

    repo
      && await setBrowserDefaults({
          config: repo,
          browserConf,
          pwComponents,
        })
    
    await actionBrowser(pwComponents, {
      ref,
      actions,
      id: req.auth.userId
    }, browserConf)
  }
  catch(err){
    resp.warning = { message: err.message, type: `BROWSER_ACTION` }
  }

  return apiRes(res, noOpObj, 200)
}


AppRouter.post('/screencast/browser/action', browserAction)