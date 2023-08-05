import { EBrowserType, EBrowserName } from '@GBR/types'

import { Logger } from '@GBR/utils/logger'
import { limbo, wait } from '@keg-hub/jsutils'
import { metadata } from '@GBR/utils/metadata'
import { DefaultBrowser } from '@GBR/constants'
import { clearAllServers, clearServer, getServer } from './server'
import { findProc, killProcAsync } from '@gobletqa/shared/libs/proc'

/**
 * Looks for a process by name and try's to kill it
 * Keeps running until no process is found by the passed in name
 */
const loopKill = async (name:EBrowserType|EBrowserName) => {

  EBrowserName[name] && clearServer(name as EBrowserName)

  const [_, statusBrowser] = await limbo(findProc(name))
  if(!statusBrowser?.pid) return

  Logger.info({ message: `Stopping Browser ${name} server...`, ...statusBrowser })
  await killProcAsync(statusBrowser)
  await wait(1000)

  loopKill(name)
} 

/**
 * Stops the running browser server if it eixsts
 */
export const stopServer = async () => {
  // Wrap the close method incase something happens
  // We still want to reset the browser reference and meta data
  try {

    Logger.info({ message: `Stopping All Browser Server...` })

    const pwServer = getServer(DefaultBrowser)
    pwServer?.close && (await pwServer?.close())

    // Kill all browsers
    await Promise.all([
      await loopKill(EBrowserType.chrome),
      await loopKill(EBrowserType.chromium),
      await loopKill(EBrowserType.firefox),
      await loopKill(EBrowserType.webkit)
    ])

  }
  catch (err) {
    Logger.error(err.message)
  }

  await metadata.remove()
  clearAllServers()
}
