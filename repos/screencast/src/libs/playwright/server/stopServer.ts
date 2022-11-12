import metadata from '../helpers/metadata'
import { Logger } from '@keg-hub/cli-utils'
import { findProc, killProc } from '../../proc'
import { setServer, getServer } from './server'
import { limbo, checkCall, wait } from '@keg-hub/jsutils'

/**
 * Looks for a process by name and try's to kill it
 * Keeps running until no process is found by the passed in name
 */
const loopKill = async (name:string) => {
  const [_, statusBrowser] = await limbo(findProc(name))
  if(!statusBrowser?.pid) return

  killProc(statusBrowser)
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
    if (pwServer) {
      pwServer.pid && killProc(pwServer)
      pwServer.close && (await pwServer.close())
    } else {
      await checkCall(async () => {
        // Kill both chrome, firefox and webkit
        await loopKill('chrome')
        await loopKill('chromium')
        await loopKill('firefox')
        await loopKill('webkit')
      })
    }
  } catch (err) {
    Logger.error(err.message)
  }

  await metadata.remove()
  setServer(undefined)
}
