import { exec } from 'child_process'
import { isObj, exists } from '@keg-hub/jsutils'

/**
 * Helper method to kill the running process based on passed in pid
 * Kill sockify and vnc process based on pid
 * The processes are detached when started
 * So we have to call `kill -9 <pid>`
 * @function
 * @public
 */
export const killProc = (
  proc:Record<`pid`, string|number>|string|number,
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
