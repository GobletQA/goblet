import type { TBrowserContextOpts, TGobletConfig } from '@GSC/types'

import { noOpObj, deepMerge } from '@keg-hub/jsutils'
import { checkVncEnv } from '../../utils/vncActiveEnv'
import { taskEnvToContextOpts } from '../../utils/taskEnvToContextOpts'
import { getGobletConfig } from '@gobletqa/shared/utils/getGobletConfig'


/**
 * Default browser options
 * @type {Object}
 */
const options = {
  host: {} as Partial<TBrowserContextOpts>,
  vnc: {
    colorScheme: `dark`
  } as Partial<TBrowserContextOpts>,
}

/**
 * Builds the config for a Playwright browser context
 */
export const getContextOpts = (
  contextOpts:TBrowserContextOpts=noOpObj as TBrowserContextOpts,
  config?:TGobletConfig
) => {
  
  const defContextOpts = checkVncEnv().vncActive
    ? options.vnc
    : options.host
  
  config = config || getGobletConfig()
  return deepMerge(
    defContextOpts,
    
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
