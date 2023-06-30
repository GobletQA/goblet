import type { RequestHandler, Response } from 'express'
import type { Request as JWTRequest } from 'express-jwt'
import type { Repo } from '@gobletqa/shared/src/repo'

import { limbo, noOpObj } from '@keg-hub/jsutils'
import { actionBrowser } from '@GSC/libs/playwright'
import { apiRes } from '@gobletqa/shared/express/apiRes'
import { asyncWrap } from '@gobletqa/shared/express/asyncWrap'
import { AppRouter } from '@gobletqa/shared/express/appRouter'
import { loadRepoFromReq } from '@gobletqa/shared/middleware/setupRepo'
import { joinBrowserConf } from '@gobletqa/shared/utils/joinBrowserConf'

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
  const resp:Record<any, any> = {}
  try {
    await actionBrowser(
      { ref, actions, id: req.auth.userId },
      browserConf,
      repo
    )
  }
  catch(err){
    resp.warning = { message: err.message, type: `BROWSER_ACTION` }
  }

  return apiRes(res, noOpObj, 200)
})


AppRouter.post('/screencast/browser/action', browserAction)