import type { TProc } from '@GSH/types'

import util from 'util'
import { exec } from 'child_process'
import { isObj } from '@keg-hub/jsutils/isObj'
import { exists } from '@keg-hub/jsutils/exists'

const execAsync = util.promisify(exec)


export const killProcAsync = async (
  proc:TProc|string|number,
  platform:string = process.platform
) => {
  const procPid = isObj(proc) ? proc.pid : proc

  return (
    exists(procPid) &&
    await execAsync(
      platform === 'win32'
        ? `taskKill /pid ${procPid} /t`
        : `kill -9 ${procPid}`
    )
  )
}

/**
 * Helper method to kill the running process based on passed in pid
 * Kill sockify and vnc process based on pid
 * The processes are detached when started
 * So we have to call `kill -9 <pid>`
 * @function
 * @public
 */
export const killProc = (
  proc:TProc|string|number,
  platform:string = process.platform
) => {
  const procPid = isObj(proc) ? proc.pid : proc

  return (
    exists(procPid) &&
    exec(
      platform === 'win32'
        ? `taskKill /pid ${procPid} /t`
        : `kill -9 ${procPid}`
    )
  )
}
