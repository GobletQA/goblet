import type { Express } from 'express'
import { GBrowser } from '@gobletqa/browser'
import { ENVS } from '@gobletqa/environment'
import { joinBrowserConf } from '@GSC/utils/joinBrowserConf'

/**
 * Helper to pre-warm the browser on server start
 */
export const setupBrowser = async (app:Express) => {

  if(ENVS.NODE_ENV !== `production` && ENVS.GB_WS_BROWSER){
    // TODO: update to use a browser server with websocket
    // Should fix issues with memory-leak due to constant browser restarting
  }
  
  const browserConf = joinBrowserConf({}, app)
  await GBrowser.start({ browserConf, config: app.locals.config })
}