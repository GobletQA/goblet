import type {
  TGBWorldCfg,
  TGobletConfig,
  TBrowserContextOpts
} from '@gobletqa/shared/types'

import { vncActive } from '@GBB/utils/checkVncEnv'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'
import { deepMerge } from '@keg-hub/jsutils/deepMerge'
import { flatUnion } from '@keg-hub/jsutils/flatUnion'
import { taskEnvToContextOpts } from '@GBB/browser/taskEnvToContextOpts'

/**
 * Default browser options
 * @type {Object}
 */
const options = {
  shared: {
    colorScheme: `no-preference`,
    /**
     * **IMPORTANT** - Do not move these until the world file can be loaded and use to set the context options
     * Otherwise tests will break
     */
    permissions: [
      `camera`,
      `microphone`,
      `geolocation`,
      `notifications`,
      `clipboard-read`,
      `clipboard-write`,
      // `midi`,
      // `gyroscope`,
      // `midi-sysex`,
      // `magnetometer`,
      // `accelerometer`,
      // `payment-handler`,
      // `background-sync`,
      // `accessibility-events`,
      // `ambient-light-sensor`,
    ],
  },
  host: {} as Partial<TBrowserContextOpts>,
  vnc: {
  } as Partial<TBrowserContextOpts>,
}

export type TGetBrowserCtxOpts = {
  world?:TGBWorldCfg
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

  const built = deepMerge<TBrowserContextOpts>(
    defContextOpts,
    options.shared,
    
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
    taskEnvToContextOpts(),
    overrides
  )

  built.permissions = flatUnion(built.permissions)

  return built
}
