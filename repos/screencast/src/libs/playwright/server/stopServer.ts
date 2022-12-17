import metadata from '../helpers/metadata'
import { Logger } from '@GSC/utils/logger'
import { findProc, killProcAsync } from '../../proc'
import { limbo, wait } from '@keg-hub/jsutils'
import { setServer, getServer, getServerProc, setServerProc } from './server'

/**
 * Looks for a process by name and try's to kill it
 * Keeps running until no process is found by the passed in name
 */
const loopKill = async (name:string) => {
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
    const pwServer = getServer()
    const pwServerProc = getServerProc()

    if (pwServer || pwServerProc) {
      Logger.info({ message: `Stopping Browser server...`, ...pwServerProc })

      pwServer?.close && (await pwServer?.close())
      await Promise.all(
        Object.values(pwServerProc)
          .map(async (proc) => proc?.pid && await killProcAsync(proc))
      )
    }
    else {
      // Kill both chrome, firefox and webkit
      await Promise.all([
        await loopKill('chrome'),
        await loopKill('chromium'),
        await loopKill('firefox'),
        await loopKill('webkit')
      ])
    }
  }
  catch (err) {
    Logger.error(err.message)
  }

  await metadata.remove()
  setServer(undefined)
  setServerProc(undefined)
}
