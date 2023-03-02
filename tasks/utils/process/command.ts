import type { TProcOpts, TTaskParams } from '../../types'

import { appRoot } from '../../paths'
import { loadEnvs } from '../envs/loadEnvs'
import { runCmd, Logger } from '@keg-hub/cli-utils'
import { processError } from '../process/processError'
import { ensureArr, noOpObj, noPropArr, isObj, parseJSON } from '@keg-hub/jsutils'

/**
 * Gets a list of current pm2 processes being run
 *
 */
export const pm2Status = async ():Promise<string[]> => {
  const { data } = await runCmd(`pm2`, [`jlist`], { exec: true })
  return parseJSON(data) || noPropArr
}

/**
 * Removes the a running PM2 daemonized process if it exists
 *
 */
export const cleanPm2Daemon = async (
  name:string,
  opts:TProcOpts = noOpObj as TProcOpts
) => {
  try {
    // Remove any existing pm2 daemons that may already be running
    await runCmd(`pm2`, [`delete`, name], opts)
    // Clean up old pm2 logs
    await runCmd(`pm2`, [`flush`], opts)
  }
  catch (err) {
    Logger.info(`Could not cleanup ${name} daemon, skipping`)
  }
}

/**
 * Starts a command as a daemon using PM2 to daemonize it
 *
 */
export const startPm2Daemon = async (
  executable:string,
  args:string[],
  opts:TProcOpts = noOpObj as TProcOpts,
  name:string,
  watch?:boolean
) => {
  Logger.log(`\nUsing pm2 to run ${executable} as a daemon...\n`)

  const daemonResp = await runCmd(
    `pm2`,
    [`start`, executable, `--name`, name, `--`].concat(args),
    { ...opts, exec: true }
  )

  if (!watch) return daemonResp

  // After running the command as a daemon, connect to the log output
  // This allows watching the script start up
  Logger.log(
    `\nThe ${executable} daemon started successfully, connecting to log output...\n`
  )
  return await runCmd(`pm2`, [`logs`, name], opts)
}

/**
 * Runs a command in a sub-process and returns the output
 * Exits the process if the devspace command throws an error
 *
 */
export const command = (executable:string) => {
  return async (
    cmd:string|string[],
    params:TTaskParams = noOpObj as TTaskParams,
    validExitCode:number|number[]=[]
  ) => {
    const {
      env,
      log,
      exec,
      envs,
      watch,
      daemon,
      throwErr,
      handleOutput,
      cwd = appRoot,
    } = params
    const args = ensureArr(cmd)

    log && Logger.pair(`Running Cmd:`, `${executable} ${args.join(' ')}\n`)

    const opts = {
      cwd,
      log,
      exec,
      envs: { ...loadEnvs({ env }), ...envs },
    }

    /**
     * Regardless of running as a daemon
     * We still want to kill a currently running daemon
     * Otherwise daemon or not the process may not restart properly, because it's already running
     * So always delete an existing PM2 daemon if it exists
     */
    const pm2Name = `${executable}-${args[0]}`
    await cleanPm2Daemon(pm2Name, { ...opts, exec: true })

    const output = daemon
      ? await startPm2Daemon(executable, args, opts, pm2Name, watch)
      : await runCmd(executable, args, opts)

    if (!isObj(output) || handleOutput) return output

    const { data, error, exitCode } = output

    exitCode
      && (throwErr || (validExitCode && !ensureArr<number[]>(validExitCode).includes(exitCode)))
      // TODO: Investigate changing to this, so error are auto-thrown when not validExitCode exists
      // && (!validExitCode || validExitCode && !ensureArr(validExitCode).includes(exitCode)) &&
      && processError(error, exitCode, log)

    log && data && Logger.pair(`Cmd Output:\n`, data)

    return data
  }
}
