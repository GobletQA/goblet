import type { TGBWorldCfg, TBrowserConf, TGobletConfig, TBrowserLaunchOpts } from '@GBB/types'

import path from 'path'
import { ENVS } from '@gobletqa/environment'
import { exists } from '@keg-hub/jsutils/exists'
import { vncActive } from '@GBB/utils/checkVncEnv'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'
import { omitKeys } from '@keg-hub/jsutils/omitKeys'
import { flatUnion } from '@keg-hub/jsutils/flatUnion'
import { noPropArr } from '@keg-hub/jsutils/noPropArr'
import { deepMerge } from '@keg-hub/jsutils/deepMerge'
import { InternalPaths } from '@gobletqa/environment/constants'
import { taskEnvToBrowserOpts } from '@GBB/browser/taskEnvToBrowserOpts'

/**
 * Default browser options
 * @type {Object}
 */
const getDefOpts = () => {
  const opts =  {
    host: {} as Partial<TBrowserConf>,
    vnc: {
      slowMo: 100,
      headless: false,
      ignoreDefaultArgs: [
        `--enable-automation`
      ],
      args: [
          // `--disable-extensions-except=${pathToExtension}`,
          // `--load-extension=${pathToExtension}`,

        `--disable-gpu`,
        `--start-maximized`,
        `--start-fullscreen`,
        // Hides the top-bar header. Should validate this this is what we want
        `--window-position=0,-75`,
        `--allow-insecure-localhost`,
        `--unsafely-treat-insecure-origin-as-secure`,
        `--use-fake-ui-for-media-stream`,
        `--use-fake-device-for-media-stream`,
        `--remote-debugging-port=${ENVS.GB_REMOTE_DEBUG_PORT}`,


        // `--user-data-dir=remote-profile`, // -- Playwright expects to be passed a dataDir instead of using this
        // `--kiosk`, // -- Use to disable right click

        // TODO - Investigate this - may be needed in some context
        // `--deny-permission-prompts`


        // --disable-web-security
        // Don't enforce the same-origin policy; meant for website testing only. This switch has no effect unless --user-data-dir (as defined by the content embedder) is also present.
        // --process-per-site
        // --site-per-process

        // To allow trace reporting to work
        // Look into always adding <meta http-equiv="Content-Security-Policy" content="default-src 'self'">
        // Or try using new Browser({ bypassCSP: true }) option in playwright

      ],
    } as Partial<TBrowserConf>,
    ci: {
      args: [],
      headless: true,
    } as Partial<TBrowserConf>,
  }

  // TODO: eventually this will be overwritten by the mounted repo 
  // If we have a path to the testUtils dir
  // Then add the fake webcam data
  if(InternalPaths?.testUtilsDir){
    const webcamLoc = path.join(InternalPaths.testUtilsDir, `media/webcam.y4m`)
    opts.vnc.args.push(`--use-file-for-fake-video-capture=${webcamLoc}`)
  }


  return opts
}


const fromBaseDir = (config:TGobletConfig) => {
  const {
    repoRoot=ENVS.GOBLET_CONFIG_BASE,
    workDir=`goblet`
  } = config.paths

  if(!repoRoot) return undefined

  return workDir ? path.join(repoRoot, workDir) : repoRoot
}

const getConfigOpts = (config:TGobletConfig) => {
  const {
    tracesDir = `artifacts/reports`,
    downloadsDir = `artifacts/downloads`,
  } = config.paths

  const baseDir = fromBaseDir(config)

  return {
    ...(baseDir && {
      tracesDir: path.join(baseDir, tracesDir),
      downloadsPath: path.join(baseDir, downloadsDir),
    })
  }
}

/**
 * Builds the config for the browser merging the defaults with the passed in config
 */
export const getBrowserOpts = (
  browserConf:TBrowserConf=emptyObj as TBrowserConf,
  config?:TGobletConfig,
  world?:TGBWorldCfg
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

  const options = getDefOpts()

  const { args: configModeArgs, ...configModeOpts } = vncActive()
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
    config ? getConfigOpts(config) : emptyObj,
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
     * Custom config options defined in the repos world object
     * Should not override passed in options, or task env options
     */
    world?.$browser,

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
     config ? omitKeys(taskEnvToBrowserOpts(), ['devices']) : emptyObj,

    {
      /**
       * By default envs from process.env are passed to the browser
       * We pass an empty object to disable that
       * If envs are needed, then they can be added here
       *
       */
      env: {
        DISPLAY: ENVS.DISPLAY
      },
      /**
       * Need to investigate, most likely do NOT want this enabled
       */
      // bypassCSP: true
    }
  )
}
