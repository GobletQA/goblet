import type { StdioOptions } from 'child_process'

import { spawn } from 'child_process'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'

/**
 * Helper to get the passed in args of the current script
 */
const getArgs = () => {
  const args = [].concat(process.argv).reduce((acc, arg) => {
    arg !== '-d' && arg !== '--daemon' && acc.push(arg)

    return acc
  }, [])

  // Remove `node` executable from args
  args.shift()
  // get the name of the script that started the original process
  const script = args.shift()

  return { args, script }
}

type TSpawnDaemon = {
  cwd:string
  stderr:string
  stdout:string
  env:Record<string, string>
}

/**
 * Daemonizes the script and return the spawned child object
 * @function
 * @public
 */
export const spawnDaemon = (
  script:string,
  args:string[],
  opt:TSpawnDaemon = emptyObj as TSpawnDaemon
) => {
  const defstd = 'inherit'

  const {
    env = emptyObj,
    stdout = defstd,
    stderr = defstd,
    cwd = process.cwd(),
  } = opt

  const spawnOpts = {
    cwd,
    // Detaches the spawed process from the parent
    detached: true,
    env: { ...env, ...process.env } as NodeJS.ProcessEnv,
    stdio: [defstd, stdout, stderr] as StdioOptions,
  }

  // spawn the child using the same node process as ours
  const child = spawn(process.execPath, [script].concat(args), spawnOpts)

  // Remove reference to the child so the parent process can exit
  child.unref()

  return child
}

/**
 * Turns the process into a daemon by recalling it's self, then disconnecting
 * **IMPORTANT** - exits the current process after spawning it's self as a child
 * @function
 * @public
 */
export const daemonize = (opt:TSpawnDaemon = emptyObj as TSpawnDaemon) => {
  // we are a daemon, don't daemonize again
  if (process.env.__ALREADY_DAEMONIZED) return process.pid

  const { args, script } = getArgs()

  const env = {
    ...process.env,
    ...opt.env,
    // Helper ENV so the child process can identify it as being a daemon
    __ALREADY_DAEMONIZED: true,
  }

  // Restart the current script as a daemon
  spawnDaemon(script, args, opt)

  // exit the parent process, but the child will continue running
  return process.exit()
}
