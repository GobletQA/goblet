import type { TSSLCreds, TChildProcArgs } from '@GSC/types'
import fs from 'fs'
import { Logger } from '@keg-hub/cli-utils'
import { findProc, killProc } from '@GSC/libs/proc'
import { screencastConfig } from '@GSC/Configs/screencast.config'
import { getGobletConfig } from '@gobletqa/shared/utils/getGobletConfig'
import { create as childProc } from '@keg-hub/spawn-cmd/src/childProcess'
import {
  limbo,
  noOpObj,
  deepMerge,
  flatUnion,
  noPropArr,
} from '@keg-hub/jsutils'


const defSockArgs = noOpObj as TChildProcArgs

/**
 * Starts websockify to allow loading VNC in the browser
 * @function
 * @public
 * @param {Object} args - options for setting up websockify
 * @param {Array} args.args - Arguments to pass to the websockify command
 * @param {Array} args.cwd - Location where the command should be run
 * @param {Array} args.env - Extra environment variables to pass
 *
 * @example
 * websockify -v --web /usr/share/novnc 0.0.0.0:26369 0.0.0.0:26370
 * @returns {Object} - Child process running websockify
 */
export const startSockify = async ({
  cwd,
  env = noOpObj,
  args = noPropArr,
  options = noOpObj,
}:TChildProcArgs=defSockArgs) => {

  const config = getGobletConfig()
  const { novnc, vnc } = screencastConfig.screencast
  const status = await statusSockify()

  if (status.pid) {
    Logger.pair(`- Websockify already running with pid:`, status.pid)
    return status
  }

  const creds:TSSLCreds = {
    key: process.env.GB_SSL_KEY,
    cert: process.env.GB_SSL_CERT,
    ca: process.env.GB_SSL_CA,
  }

  const credentials = Object.entries(creds).reduce((conf, [key, loc]) => {
    fs.existsSync(loc) && (conf[key] = creds[key])

    return conf
  }, {} as TSSLCreds)

  const wssArgs = credentials.cert && credentials.key
    ? [`--cert=${credentials.cert}`, `--key=${credentials.key}`]
    : []

  Logger.log(`- Starting websockify server...`)
  const child = await childProc({
    cmd: 'websockify',
    args: flatUnion(
      [
        '-v',
        ...wssArgs,
        '--web',
        '/usr/share/novnc',
        `${novnc.host}:${novnc.port}`,
        `${vnc.host}:${vnc.port}`,
      ],
      args
    ),
    options: deepMerge(
      {
        detached: true,
        // stdio: 'ignore',
        cwd: cwd || config.internalPaths.gobletRoot,
        env: { ...process.env },
      },
      options,
      { env }
    ),
    log: true,
  })

  // Tell spawn-cmd not to close the process on exit of parent process
  child.__spOnExitCalled = true
  
  return child
}

/**
 * Stops the websockify server if it's running
 * If no reference exists, calls findProc to get a reference to the PID
 * @function
 * @public
 *
 * @return {Void}
 */
export const stopSockify = async () => {
  const status = await statusSockify()
  status && status.pid && killProc(status)
}

/**
 * Gets the status of the tiger vnc server
 *
 * @returns {Object} - Status of the tiger vnc process
 */
export const statusSockify = async () => {
  const [_, status] = await limbo(findProc('websockify'))
  return status
}

