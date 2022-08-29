import type { Response, Request } from 'express'

import { noOpObj } from '@keg-hub/jsutils'
import { actionBrowser } from '@GSC/libs/playwright'
import { apiRes } from '@gobletqa/shared/express/apiRes'
import { asyncWrap } from '@gobletqa/shared/express/asyncWrap'
import { AppRouter } from '@gobletqa/shared/express/appRouter'
import { joinBrowserConf } from '@gobletqa/shared/utils/joinBrowserConf'

/**
 * Execute an action on a playwright component ( browser, context, page )
 *
 */
const browserAction = asyncWrap(async (req:Request, res:Response) => {
  const { body } = req
  const { ref, actions, ...browser } = body
  const browserConf = joinBrowserConf(browser)

  // @ts-ignore
  await actionBrowser({ ref, actions, id: req.user.userId }, browserConf)

  return apiRes(res, noOpObj, 200)
})


AppRouter.post('/screencast/browser/action', browserAction)