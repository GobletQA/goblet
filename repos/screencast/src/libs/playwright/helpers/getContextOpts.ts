import type { TBrowserContextOpts, TGobletConfig } from '@GSC/types'

import { noOpObj, deepMerge } from '@keg-hub/jsutils'
import { taskEnvToContextOpts } from '../../utils/taskEnvToContextOpts'
import { getGobletConfig } from '@gobletqa/shared/utils/getGobletConfig'

/**
 * Builds the config for a Playwright browser context
 * @param {Object} contextOpts - Playwright browser context config
 * @param {Object} config - Global goblet config object
 *
 * @returns {Object} - Built context config
 */
export const getContextOpts = (
  contextOpts:TBrowserContextOpts=noOpObj as TBrowserContextOpts,
  config?:TGobletConfig
) => {
  config = config || getGobletConfig()
  return deepMerge(
    /**
     * The default config options from the global config.config.js
     */
    config?.screencast?.screencast?.context,
    /**
     * Options passed to this function as the first argument
     * Should override all except for options set by a task via ENVs
     */
    contextOpts,
    /**
     * Task env opts overrides all others
     * These come from the options passed to a task that started the process
     * This ensures those options gets set
     */
    taskEnvToContextOpts(config)
  )
}
