import type { TBrowserProcs } from '@GBB/types'

import { Logger } from '@GBB/utils/logger'
import { get } from '@keg-hub/jsutils/get'
import { statusServer } from './statusServer'

export const checkServerPid = async (browser:string) => {
  const status = await statusServer()

  const sPid = get<string|number>(status, [browser, `pid`])
  if(!sPid) return

  Logger.info(`- ${browser} browser server already running with pid: ${sPid}`)

  // Get the most up-to-date server processes after setting it
  // Should be the same as the status variable
  return status[browser as keyof TBrowserProcs]

}