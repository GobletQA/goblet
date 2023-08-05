import type playwright from 'playwright'
import type { TGobletConfig, TBrowserLaunchOpts } from '@GBR/types'

import { toBool, isStr, emptyObj } from '@keg-hub/jsutils'
import { parseJsonEnvArr } from '@GBR/utils/parseJsonEnvArr'

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
  const {
    GOBLET_HEADLESS,
    GOBLET_DEV_TOOLS,
    GOBLET_BROWSER_DEVICES,
    GOBLET_BROWSER = `chromium`,
    GOBLET_BROWSER_SLOW_MO = `50`,
    GOBLET_BROWSER_TIMEOUT = `10000`, // 10 seconds
  } = process.env

  // Save videos to the temp dir, and copy them to the repo dir as needed, I.E. if a test fails
  const { tracesTempDir, downloadsTempDir } = config.internalPaths

  return {
    type: GOBLET_BROWSER,
    tracesDir: tracesTempDir,
    downloadsPath: downloadsTempDir,
    headless: toBool(GOBLET_HEADLESS),
    devtools: toBool(GOBLET_DEV_TOOLS),
    slowMo: parseInt(GOBLET_BROWSER_SLOW_MO, 10),
    timeout: parseInt(GOBLET_BROWSER_TIMEOUT, 10),
    ...buildDeviceList(GOBLET_BROWSER_DEVICES),
  } as Partial<TBrowserLaunchOpts & { devices: string[] }>
}
