import type { TProc, TSSLCreds, TChildProcArgs } from '@GSC/types'

import fs from 'fs'
import { exec } from 'node:child_process'
import { Logger } from '@GSC/utils/logger'
import { findProc, killProc } from '@GSC/libs/proc'
import { screencastConfig } from '@GSC/Configs/screencast.config'
import { getDefaultGobletConfig } from '@gobletqa/shared/goblet/getDefaultGobletConfig'
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

  const config = getDefaultGobletConfig()
  const { novnc, vnc } = screencastConfig.screencast
  const status = await statusSockify()

  if (status.pid) {
    Logger.info(`- Websockify already running with pid:`, status.pid)
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

  const cmdArgs = flatUnion(
    [
      '-v',
      ...wssArgs,
      '--web',
      '/usr/share/novnc',
      `${novnc.host}:${novnc.port}`,
      `${vnc.host}:${vnc.port}`,
    ],
    args
  )

  const cmdOpts = deepMerge({
    stdio:'inherit',
    env: { ...process.env },
    cwd: cwd || config.internalPaths.gobletRoot,
  }, options, { env })

  const cmd = `websockify ${cmdArgs.join(' ')}`
  Logger.info(`Starting Websockify server`, { cmd })

  return exec(cmd, cmdOpts)

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
  const [_, status] = await limbo<TProc>(findProc('websockify'))
  return status
}

