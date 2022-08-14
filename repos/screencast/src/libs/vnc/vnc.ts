import type { TChildProcArgs } from '@GSC/types'

import { Logger }from '@keg-hub/cli-utils'
import { findProc, killProc }from '@GSC/libs/proc'
import { screencastConfig } from '@GSC/Configs/screencast.config'
import { getGobletConfig }from '@gobletqa/shared/utils/getGobletConfig'
import { create as childProc }from '@keg-hub/spawn-cmd/src/childProcess'
import {
  limbo,
  noOpObj,
  deepMerge,
  flatUnion,
  noPropArr,
} from '@keg-hub/jsutils'

const defVncArgs = noOpObj as TChildProcArgs

/**
 * Cache holder for the tigervnc process
 * @type {Object|undefined}
 */

/**
 * Starts tigervnc to allow loading VNC in the browser
 * @param {Object} [args] - options for setting up tigervnc
 * @param {Array} args.args - Arguments to pass to the Xtigervnc command
 * @param {Array} args.cwd - Location where the command should be run
 * @param {Array} args.env - Extra environment variables to pass
 *
 * @example
 * // With auth
 * Xtigervnc -SecurityTypes None -geometry 1440x900x24 -rfbauth /root/.vnc/passwd -rfbport 26370 -alwaysshared :0
 * @example
 * // With arm64 hack
 * LD_PRELOAD=/lib/aarch64-linux-gnu/libgcc_s.so.1 /usr/bin/Xtigervnc -SecurityTypes None -geometry 1440x900x24 -rfbport 26370 -alwaysshared :0
 *
 * @returns {Object} - Child process running tigervnc
 */
export const startVNC = async ({
  cwd,
  env = noOpObj,
  args = noPropArr,
  options = noOpObj,
}:TChildProcArgs=defVncArgs) => {
  const status = await statusVNC()

  if (status.pid) {
    Logger.pair(`- Tigervnc already running with pid:`, status.pid)
    return status
  }

  Logger.log(`- Starting tigervnc server...`)
  const config = getGobletConfig()
  const { vnc } = screencastConfig.screencast

  const resp =await childProc({
    log: true,
    cmd: 'Xtigervnc',
    args: flatUnion(
      [
        `-verbose`,
        `-SecurityTypes`,
        `None`,
        '-geometry',
        `${vnc.width}x${vnc.height}x24`,
        `-rfbport`,
        vnc.port,
        `-alwaysshared`,
        vnc.display,
      ],
      args
    ),
    options: deepMerge(
      {
        detached: true,
        // stdio: 'ignore',
        cwd: cwd || config.internalPaths.gobletRoot,
        env: {
          ...process.env,
          DISPLAY: vnc.display,
          // Hack for arm64 machines to tigerVNC doesn't crash on client disconnect
          // This only happens on new Mac M1 machines using arm64
          // Ubuntu 20.10 should have a fix included, but playwright uses version 20.04
          // If the playwright docker image ever updates to +Ubuntu 20.10, this should be removed
          ...(process.arch === 'arm64' && {
            LD_PRELOAD: `/lib/aarch64-linux-gnu/libgcc_s.so.1`,
          }),
        },
      },
      options,
      { env }
    ),
  })
  
  Logger.log(`\nTigerVnc server settings:`)
  Logger.log(`  - Listen on ${vnc.host}:${vnc.port}`)
  Logger.log(`  - Display ${vnc.display}`)
  Logger.log(`  - Dimensions ${vnc.width}x${vnc.height}x24`)

  return resp
}

/**
 * Stops the websockify server if it's running
 * If no reference exists, calls findProc to get a reference to the PID
 *
 * @return {Void}
 */
export const stopVNC = async () => {
  const status = await statusVNC()
  status && status.pid && killProc(status)
}

/**
 * Gets the status of the tiger vnc server
 *
 * @returns {Object} - Status of the tiger vnc process
 */
export const statusVNC = async () => {
  const [_, status] = await limbo(findProc('Xtigervnc'))
  return status
}
