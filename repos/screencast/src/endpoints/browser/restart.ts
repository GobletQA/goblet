import type { Response, Request, RequestHandler } from 'express'

import { apiRes } from '@gobletqa/shared/express/apiRes'
import { asyncWrap } from '@gobletqa/shared/express/asyncWrap'
import { AppRouter } from '@gobletqa/shared/express/appRouter'
import { joinBrowserConf } from '@gobletqa/shared/utils/joinBrowserConf'
import { startBrowser, getPWComponents } from '@GSC/libs/playwright/browser/browser'

/**
 * Restarts a Browser by killing the browser context, and starting it again
 *
 */
const browserRestart:RequestHandler = asyncWrap(async (req:Request, res:Response) => {
  const { body } = req

  const browserConf = joinBrowserConf(body)

  const { context } = await getPWComponents(browserConf)
  context && await context.close()
  const { status } = await startBrowser({
    browserConf,
    overrides: body
  })
  
  // Add command to reload supervisorctl for vnc
  // But first update the following envs:
  // GB_VNC_VIEW_WIDTH,
  // GB_VNC_VIEW_HEIGHT,
  // GOBLET_CONTEXT_WIDTH,
  // GOBLET_CONTEXT_HEIGHT,
  // Set these to the correct height and widht based on what's calculated from the browser
  // I need to figure out the scale factor between the browser size and the dimensions defined with envs
  // the tigerVNC geomitry does not align with the h/w px size within the browser
  // So the dom element doesn't match the size we need it to be
  //  Also try sending key command
        // await page.keyboard.press('F11')
        // await page.keyboard.press('Cmd+Shift+F')
        // await page.keyboard.press('Control+Shift+F')
  return apiRes(res, status, 200)
})

AppRouter.post('/screencast/browser/restart', browserRestart)