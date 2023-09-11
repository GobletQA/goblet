import type { TWorldConfig } from '@ltipton/parkin'
import type { TBrowserContextOpts, TGobletConfig } from '@GBB/types'

import { vncActive } from '@GBB/utils/checkVncEnv'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'
import { deepMerge } from '@keg-hub/jsutils/deepMerge'
import { taskEnvToContextOpts } from '@GBB/browser/taskEnvToContextOpts'


const browserPermissions = [
  // `camera`,
  // `microphone`,
  // `geolocation`,
  // `midi`,
  // `midi-sysex`,
  // `notifications`,
  // `background-sync`,
  // `ambient-light-sensor`,
  // `accelerometer`,
  // `gyroscope`,
  // `magnetometer`,
  // `accessibility-events`,
  // `clipboard-read`,
  // `clipboard-write`,
  // `payment-handler`,
]

/**
 * Default browser options
 * @type {Object}
 */
const options = {
  host: {} as Partial<TBrowserContextOpts>,
  vnc: {
    colorScheme: `no-preference`,
    permissions: browserPermissions,
  } as Partial<TBrowserContextOpts>,
}

export type TGetBrowserCtxOpts = {
  world?:TWorldConfig
  config?:TGobletConfig
  overrides?:TBrowserContextOpts
  contextOpts?:TBrowserContextOpts
}

/**
 * Builds the config for a Playwright browser context
 */
export const getContextOpts = (args:TGetBrowserCtxOpts) => {
  const {
    world,
    config,
    overrides=emptyObj,
    contextOpts=emptyObj,
  } = args

  const defContextOpts = vncActive()
    ? options.vnc
    : options.host

  return deepMerge<TBrowserContextOpts>(
    defContextOpts,
    /**
     * The config options from the repos world config
     */
    world?.$context,

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
