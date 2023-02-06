import type { Express } from 'express'
import { joinBrowserConf } from '@gobletqa/shared/utils/joinBrowserConf'
import { startBrowser } from '@GSC/libs/playwright/browser/browser'

/**
 * Helper to pre-warm the browser on server start
 */
export const setupBrowser = async (app:Express) => {
  const browserConf = joinBrowserConf({ addAutomate: true }, app)
  await startBrowser(browserConf)
}