import type { Express } from 'express'
import type { TBrowserConf } from '@GSH/types'
import { getApp } from '@GSH/express/app'
import { get, noOpObj } from '@keg-hub/jsutils'

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
