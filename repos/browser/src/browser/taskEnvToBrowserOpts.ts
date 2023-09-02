import type { TGobletConfig, TBrowserLaunchOpts } from '@GBB/types'

import { ENVS } from '@gobletqa/environment'
import { isStr } from '@keg-hub/jsutils/isStr'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'
import { parseJsonEnvArr } from '@GBB/utils/parseJsonEnvArr'


/**
 * Builds a list of devices to used based on the GOBLET_BROWSER_DEVICES env
 */
const buildDeviceList = (envVal:string) => {
  if(!envVal) return emptyObj
  
  const { devices } = parseJsonEnvArr('devices', envVal)
  if(!devices) return emptyObj

  return devices.reduce((acc, device) => {
    device &&
      isStr(device) &&
      acc.devices.push(device.replace(/-/g, ' '))

    return acc
  }, {devices: []})
}

/**
 * Gets the browser opts set as envs when a task is run
 * This allows passing values into the test environment
 */
export const taskEnvToBrowserOpts = (config:TGobletConfig) => {
  // Save videos to the temp dir, and copy them to the repo dir as needed, I.E. if a test fails
  const { tracesTempDir, downloadsTempDir } = config.internalPaths

  return {
    tracesDir: tracesTempDir,
    type: ENVS.GOBLET_BROWSER,
    downloadsPath: downloadsTempDir,
    headless: ENVS.GOBLET_HEADLESS,
    devtools: ENVS.GOBLET_DEV_TOOLS,
    slowMo: ENVS.GOBLET_BROWSER_SLOW_MO,
    timeout: ENVS.GOBLET_BROWSER_TIMEOUT,
    ...buildDeviceList(ENVS.GOBLET_BROWSER_DEVICES),
  } as Partial<TBrowserLaunchOpts & { devices: string[] }>
}
