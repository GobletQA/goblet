import type { TBrowserContextOpts, TGobletConfig } from '@GBB/types'
import type playwright from 'playwright'

import { vncActive } from '@GBB/utils/checkVncEnv'
import { emptyObj, deepMerge } from '@keg-hub/jsutils'
import { taskEnvToContextOpts } from '@GBB/browser/taskEnvToContextOpts'


/**
 * Default browser options
 * @type {Object}
 */
const options = {
  host: {} as Partial<TBrowserContextOpts>,
  vnc: {
    colorScheme: `no-preference`
  } as Partial<TBrowserContextOpts>,
}

export type TGetBrowserCtxOpts = {
  config?:TGobletConfig
  overrides?:TBrowserContextOpts
  contextOpts?:TBrowserContextOpts
}

/**
 * Builds the config for a Playwright browser context
 */
export const getContextOpts = (args:TGetBrowserCtxOpts) => {
  const {
    config,
    overrides=emptyObj,
    contextOpts=emptyObj,
  } = args

  const defContextOpts = vncActive()
    ? options.vnc
    : options.host

  return deepMerge<TBrowserContextOpts>(
    defContextOpts,
    
    // TODO: FIX THIS - should not set the context config from screencast config
    /**
     * The default config options from the global config.config.js
     */
    config ? config?.screencast?.screencast?.context : emptyObj,
    // TODO: FIX THIS - should not set the context config from screencast config


    // TODO: look at add $world.context

    /**
     * The config options from the repos goblet config
     */
    config ? config?.playwright?.context : emptyObj,
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
    taskEnvToContextOpts(config),
    overrides
  )
}
