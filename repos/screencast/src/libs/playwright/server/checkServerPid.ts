import type { TBrowserProcs } from '@GSC/types'

import { get } from '@keg-hub/jsutils'
import { Logger } from '@GSC/utils/logger'
import { statusServer } from './statusServer'
import { setServerProc } from './server'

export const checkServerPid = async (browser:string) => {
  const status = await statusServer()
  const sPid = get<string|number>(status, [browser, `pid`])

  if (sPid) {
    Logger.info(`- Browser ${browser} server already running with pid: ${sPid}`)
    setServerProc(status)

    // Get the most up-to-date server processes after setting it
    // Should be the same as the status variable
    return status[browser as keyof TBrowserProcs]
  }
}