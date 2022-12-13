import metadata from '../helpers/metadata'
import { Logger } from '@GSC/utils/logger'
import { findProc, killProc } from '../../proc'
import { limbo, checkCall, wait } from '@keg-hub/jsutils'
import { setServer, getServer, getServerProc, setServerProc } from './server'

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
    const pwServerProc = getServerProc()
  
    if (pwServer || pwServerProc) {
      pwServer?.close && (await pwServer?.close())
      Object.values(pwServerProc).forEach(proc => proc?.pid && killProc(proc))
    }
    else {
      await checkCall(async () => {
        // Kill both chrome, firefox and webkit
        await loopKill('chrome')
        await loopKill('chromium')
        await loopKill('firefox')
        await loopKill('webkit')
      })
    }
  }
  catch (err) {
    Logger.error(err.message)
  }

  await metadata.remove()
  setServer(undefined)
  setServerProc(undefined)
}
