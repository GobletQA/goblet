import type { Repo } from '@gobletqa/workflows'
import type { RequestHandler, Response } from 'express'
import type { Request as JWTRequest } from 'express-jwt'

import { limbo, noOpObj } from '@keg-hub/jsutils'
import { apiRes } from '@gobletqa/shared/express/apiRes'
import { loadRepoFromReq } from '@GSC/middleware/setupRepo'
import { asyncWrap } from '@gobletqa/shared/express/asyncWrap'
import { AppRouter } from '@gobletqa/shared/express/appRouter'
import { joinBrowserConf } from '@gobletqa/shared/utils/joinBrowserConf'
import { setBrowserDefaults, getPWComponents, actionBrowser } from '@gobletqa/browser'

/**
 * Execute an action on a playwright component ( browser, context, page )
 *
 */
const browserAction:RequestHandler = asyncWrap(async (req:JWTRequest, res:Response) => {
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

  const pwComponents = await getPWComponents({
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
})


AppRouter.post('/screencast/browser/action', browserAction)