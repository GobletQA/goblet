import type { Express } from 'express'
import type { TBrowserConf } from '@gobletqa/shared/types'

import { get } from '@keg-hub/jsutils/get'
import { noOpObj } from '@keg-hub/jsutils/noOpObj'
import { getApp } from '@gobletqa/shared/api/express/app'

/**
 * Builds a browser config merging the passed in params and global config.browser settings
 */
export const joinBrowserConf = (
  options:Partial<TBrowserConf>=noOpObj as TBrowserConf,
  app?:Express
) => {
  app = app || getApp()

  return {
    ...get(app, 'locals.config.browser', noOpObj),
    ...get(app, 'locals.config.screencast.browser', noOpObj),
    ...options,
  } as TBrowserConf
}
