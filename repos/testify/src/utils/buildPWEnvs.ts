import type { TBuildPWEnvs } from '@GTU/Types'

import { ENVS } from '@gobletqa/environment'
import { addEnv } from '@gobletqa/shared/utils'

type TEnvObject = {
  [k:string]:string|boolean|number
}

/**
 * Adds the default playwright ENVs to the current process
 * Uses the passed in params and browser to set the values
 * Automatically adds to the current process
 * 
 * @param {Object} env - Object that holds the Envs
 * @param {string} browser - Name of the browser the ENVs relate to
 * @param {Object} params - Options passed from the task parsed into an Object with args-parse
 * 
 * @returns {Object} - env object with the ENVs added
 */
export const buildPWEnvs = (
  params?:TBuildPWEnvs,
  env:TEnvObject={} as TEnvObject,
  runFromUi?:boolean
) => {
  const {
    GOBLET_RUN_FROM_UI,
    GOBLET_RUN_FROM_CI,
  } = ENVS

  // Check if running form the UI and set the display as well as spec result logging
  if(runFromUi || GOBLET_RUN_FROM_UI){
    addEnv(env, `DISPLAY`, `:0.0`)
    addEnv(env, `GOBLET_RUN_FROM_UI`, 1)
  }
  else if(GOBLET_RUN_FROM_CI){
    env.NODE_ENV = `test`
    addEnv(env, `GOBLET_RUN_FROM_CI`, 1)
    addEnv(env, `DEBUG`, params.debugBrowser)
    params.devtools && (env.GOBLET_DEV_TOOLS = true)
  }

  // Playwright browser ENVs
  addEnv(env, `GOBLET_BROWSER`, params.browser)
  addEnv(env, `GOBLET_HEADLESS`, params.headless)
  addEnv(env, `GOBLET_PAGE_REUSE`, params.reusePage)
  addEnv(env, `GOBLET_BROWSER_SLOW_MO`, params.slowMo)
  addEnv(env, `GOBLET_CONTEXT_REUSE`, params.reuseContext)
  addEnv(env, `GOBLET_BROWSER_TIMEOUT`, params.browserTimeout)
  addEnv(env, `GOBLET_BROWSER_DEVICES`, params.devices, JSON.stringify(params.devices))

  // Playwright Context ENVs
  addEnv(env, `GOBLET_CONTEXT_TZ`, params.timezone)
  addEnv(env, `GOBLET_CONTEXT_WIDTH`, params.width)
  addEnv(env, `GOBLET_CONTEXT_HEIGHT`, params.height)
  addEnv(env, `GOBLET_CONTEXT_TOUCH`, params.hasTouch)
  addEnv(env, `GOBLET_CONTEXT_MOBILE`, params.isMobile)
  addEnv(env, `GOBLET_CONTEXT_DOWNLOADS`, params.downloads)
  addEnv(env, `GOBLET_CONTEXT_GEO`, params.geolocation, JSON.stringify(params.geolocation))
  addEnv(env, `GOBLET_CONTEXT_PERMISSIONS`, params.permissions, JSON.stringify(params.permissions))

  addEnv(env, `GOBLET_TEST_TRACING`, params.tracing)
  addEnv(env, `GOBLET_TEST_REPORT`, params.testReport)
  addEnv(env, `GOBLET_TEST_VIDEO_RECORD`, params.video)
  addEnv(env, `GOBLET_TEST_SCREENSHOT`, params.screenshot)
  addEnv(env, `GOBLET_TEST_DEBUG`, params.testDebug)
  addEnv(env, `GOBLET_TEST_HTML_COMBINE_REPORT`, params.htmlCombine)
  

  addEnv(env, `NODE_ENV`, params.nodeEnv)

  // Disable adding playwright to the browser console
  addEnv(env, `PWDEBUG`, 0)

  return env
}
