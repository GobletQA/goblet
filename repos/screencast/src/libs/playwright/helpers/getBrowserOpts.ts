import type PW from 'playwright'
import type { TBrowserConf, TGobletConfig, TBrowserLaunchOpts } from '@GSC/types'
import type playwright from 'playwright'

import path from 'path'
import { checkVncEnv } from '../../utils/vncActiveEnv'
import { taskEnvToBrowserOpts } from '../../utils/taskEnvToBrowserOpts'
import { getGobletConfig } from '@gobletqa/shared/goblet/getGobletConfig'
import { getRepoGobletDir } from '@gobletqa/shared/utils/getRepoGobletDir'
import {
  exists,
  noOpObj,
  omitKeys,
  flatUnion,
  noPropArr,
  deepMerge,
} from '@keg-hub/jsutils'


/**
 * Default browser options
 * @type {Object}
 */
const options = {
  host: {} as Partial<TBrowserConf>,
  vnc: {
    slowMo: 100,
    headless: false,
    ignoreDefaultArgs: [
      `--enable-automation`,
      // `--no-startup-window`
    ],
    args: [
        // `--disable-extensions-except=${pathToExtension}`,
        // `--load-extension=${pathToExtension}`,
      `--kiosk`,

      `--disable-gpu`,
      // `--start-maximized`,
      // `--start-fullscreen`,
      // `--app=https://www.gobletqa.com`,
      `--kiosk`,
      `--disable-infobars `,
      // Hides the top-bar header. Should validate this this is what we want
      // `--window-position=0,-74`,
      // `--window-position=0,0`,
      `--allow-insecure-localhost`,
      `--unsafely-treat-insecure-origin-as-secure`,

      // TODO - Investigate this - may be needed in some context
      // `--deny-permission-prompts`
      // Investigate this - May allow keeping the browser alive in goblet UI app
      // Don't want this when running in CI or other environments
      // `--keep-alive-for-test`
    ],
  } as Partial<TBrowserConf>,
  ci: {
    args: [],
    headless: true,
  } as Partial<TBrowserConf>,
}

const getGobletConfigOpts = (config:TGobletConfig) => {
  const {
    tracesDir = `artifacts/traces`,
    downloadsDir = `artifacts/downloads`,
  } = config.paths

  const baseDir = getRepoGobletDir(config)
  return {
    ...config?.screencast?.screencast?.browser,
    tracesDir: path.join(baseDir, tracesDir),
    downloadsPath: path.join(baseDir, downloadsDir),
  }
}

/**
 * Builds the config for the browser merging the defaults with the passed in config
 */
export const getBrowserOpts = (
  browserConf:TBrowserConf=noOpObj as TBrowserConf,
  config?:TGobletConfig
) => {
  const {
    ws,
    channel,
    restart,
    headless,
    colorScheme,
    // Config for creating a browser context
    // Should not be included in the browser options
    context,
    page,
    args = noPropArr,
    // type / url is not used, just pulled out of the config object
    type,
    url,
    ...argumentOpts
  } = browserConf

  config = config || getGobletConfig()
  const { args: configModeArgs, ...configModeOpts } = checkVncEnv().vncActive
    ? options.vnc
    : options.host

  const {
    args:ciArgs,
    ...ciConfigModeOpts
  } = (process.env.GOBLET_RUN_FROM_CI ? options.ci : {}) as Partial<TBrowserConf>

  return deepMerge<TBrowserLaunchOpts>(
    /**
     * Gets the default config options from the global goblet.config.js
     */
    getGobletConfigOpts(config),
    /**
     * Default options set based on the config mode i.e. local || vnc
     */
    configModeOpts,
    ciConfigModeOpts,
    /**
     * Generated options passed on passed in arguments
     * Allows only setting properties if they actually exist
     */
    {
      args: flatUnion(configModeArgs, ciArgs, args),
      ...(exists(headless) && { headless }),
      ...(exists(channel) && { channel }),
      colorScheme: colorScheme || `no-preference`,
    },
    /**
     * Options passed to this function as the first argument
     * Should override all except for options set by a task via ENVs
     */
    argumentOpts,
    /**
     * Task env opts overrides all others
     * These come from the options passed to a task that started the process
     * This ensures those options gets set
     * Also, excludes the devices list from the returned Object
     */
     omitKeys(taskEnvToBrowserOpts(config), ['devices']),
     
    {
      /**
       * By default envs from process.env are passed to the browser
       * We pass an empty object to disable that
       * If envs are needed, then they can be added here
       *
       */
      env: {
        DISPLAY: process.env.DISPLAY
      },
      /**
       * Need to investigate, most likely do NOT want this enabled
       */
      // bypassCSP: true
    }
  )
}
