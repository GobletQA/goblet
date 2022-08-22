import type { Response, Request } from 'express'
import { parseJSON } from '@keg-hub/jsutils'
import { statusScreencast } from '@GSC/screencast'
import { asyncWrap, apiRes } from '@gobletqa/shared/express'
import { AppRouter } from '@gobletqa/shared/express/appRouter'

/**
 * Endpoint to get the current status  of the browser
 */
export const scStatus = asyncWrap(async (req:Request, res:Response) => {
  const { query } = req
  const status = await statusScreencast({
    ...query,
    // @ts-ignore
    ...(query.browser && { browser: parseJSON(query.browser, false) }),
  })
  status.lastCheck = new Date().getTime()

  return apiRes(res, status, 200)
})

AppRouter.get('/screencast/status', scStatus)
