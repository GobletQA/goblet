import type {
  TProcConfig,
  TCmdExecOpts,
  TCmdExecEvents,
} from '@GSC/types'

import { spawn } from 'child_process'
import { noOpObj } from '@keg-hub/jsutils/noOpObj'
import { noPropArr } from '@keg-hub/jsutils/noPropArr'
import { deepMerge } from '@keg-hub/jsutils/deepMerge'

/**
 * Default options when executing a command
 * @object
 */
const defOpts:TCmdExecOpts = {
  gid: process.getgid(),
  uid: process.getuid(),
  env: process.env,
  stdio: 'pipe',
}

/**
 * Creates a child process and executes a command
 * @function
 * @public
 * @export
 */
export const exec = async (
  config:TProcConfig = noOpObj as TProcConfig,
  cmd:string,
  args:string[] = noPropArr as string[],
  opts:TCmdExecOpts = noOpObj as TCmdExecOpts,
  events:TCmdExecEvents = noOpObj as TCmdExecEvents,
  cwd?:string,
  env:Record<string, string> = noOpObj as Record<string, string>,
) => {

  const childProc = spawn(
    cmd,
    args,
    deepMerge(
      defOpts,
      {
        cwd: cwd || process.cwd(),
        detached: false,
        shell: '/bin/bash',
        env,
      },
      opts
    )
  )

  childProc.stdout && childProc.stdout.setEncoding('utf-8')
  childProc.stderr && childProc.stderr.setEncoding('utf-8')

  childProc.on('error', events.onError)
  childProc.on('exit', events.onExit)
  childProc.stdout.on('data', events.onStdOut)
  childProc.stderr.on('data', events.onStdErr)
}
