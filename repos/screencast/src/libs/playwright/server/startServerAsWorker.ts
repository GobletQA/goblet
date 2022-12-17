import type { TBrowserConf } from '@GSC/types'

import path from 'path'
import { stopServer } from './stopServer'
import { noOpObj } from '@keg-hub/jsutils'
import { checkServerPid } from './checkServerPid'
import { ChildBrowserServerKey } from '@GSC/constants'
import { getBrowserType } from '../helpers/getBrowserType'
import { getGobletConfig } from '@gobletqa/shared/utils/getGobletConfig'
import { create as childProc } from '@keg-hub/spawn-cmd/src/childProcess'

export const startServerAsWorker = async (
  browserConf:TBrowserConf = noOpObj as TBrowserConf,
) => {
  const browser = getBrowserType(browserConf.type)
  const found = await checkServerPid(browser)

  found && await stopServer()

  const config = getGobletConfig()

  const child = await childProc({
    cmd: 'node',
    args: [
      `-r`,
      `esbuild-register`,
      path.join(config.internalPaths.screencastDir, `./browserServer.ts`),
      ChildBrowserServerKey,
      browser,
      JSON.stringify(browserConf)
    ],
    options: {
      detached: true,
      cwd: config.internalPaths.screencastDir,
      env: { ...process.env },
    },
    log: true,
  })


  // Tell spawn-cmd not to close the process on exit of parent process
  child.__spOnExitCalled = true

  return child
}
