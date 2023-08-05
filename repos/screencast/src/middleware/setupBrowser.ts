import type { Express } from 'express'
import { startBrowser } from '@gobletqa/browser'
import { joinBrowserConf } from '@gobletqa/shared/utils/joinBrowserConf'

/**
 * Helper to pre-warm the browser on server start
 */
export const setupBrowser = async (app:Express) => {
  const browserConf = joinBrowserConf({}, app)
  await startBrowser({ browserConf })
}