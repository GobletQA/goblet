import type { TBrowserLaunchOpts } from '@GBB/types'

import { ENVS } from '@gobletqa/environment'
import { isStr } from '@keg-hub/jsutils/isStr'
import { cleanColl } from '@keg-hub/jsutils/cleanColl'
import { InternalPaths } from '@gobletqa/environment/constants'

import { emptyObj } from '@keg-hub/jsutils/emptyObj'
import { parseJsonEnvArr } from '@GBB/utils/parseJsonEnvArr'


/**
 * Builds a list of devices to used based on the GOBLET_BROWSER_DEVICES env
 */
const buildDeviceList = (envVal:string) => {
  if(!envVal) return emptyObj
  
  const { devices } = parseJsonEnvArr('devices', envVal)
  if(!devices) return emptyObj

  const built = devices.reduce((acc, device) => {
    device &&
      isStr(device) &&
      acc.devices.push(device.replace(/-/g, ' '))

    return acc
  }, {devices: []})
  
  return built?.devices?.length ? built : emptyObj
}

/**
 * Gets the browser opts set as envs when a task is run
 * This allows passing values into the test environment
 */
export const taskEnvToBrowserOpts = () => {
  // Save videos to the temp dir, and copy them to the repo dir as needed, I.E. if a test fails
  const { tracesTempDir, downloadsTempDir } = InternalPaths

  return cleanColl<Partial<TBrowserLaunchOpts & { devices?: string[], type?: string }>>({
    tracesDir: tracesTempDir,
    type: ENVS.GOBLET_BROWSER,
    downloadsPath: downloadsTempDir,
    headless: ENVS.GOBLET_HEADLESS,
    devtools: ENVS.GOBLET_DEV_TOOLS,
    slowMo: ENVS.GOBLET_BROWSER_SLOW_MO,
    timeout: ENVS.GOBLET_BROWSER_TIMEOUT,
    ...buildDeviceList(ENVS.GOBLET_BROWSER_DEVICES),
  })
}
