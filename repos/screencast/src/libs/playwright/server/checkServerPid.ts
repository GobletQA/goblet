
import { get } from '@keg-hub/jsutils'
import { Logger } from '@keg-hub/cli-utils'
import { statusServer } from './statusServer'
import { setServer, getServer } from './server'

export const checkServerPid = async (browser:string) => {
  const pwServer = getServer()
  const status = await statusServer()
  const sPid = get(status, [browser, `pid`])
  if (sPid) {
    Logger.pair(`- Browser ${browser} server already running with pid:`, sPid)
    // If no playwright server is set, then set it
    !pwServer && setServer(status)
    // Get the most up-to-date server after setting it
    // Should be the same as the status variable
    return getServer()
  }
}