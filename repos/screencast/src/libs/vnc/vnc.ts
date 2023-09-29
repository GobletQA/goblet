import type { TProc, TChildProcArgs } from '@GSC/types'

import { exec } from 'child_process'
import { Logger } from '@GSC/utils/logger'
import { limbo } from '@keg-hub/jsutils/limbo'
import { noOpObj } from '@keg-hub/jsutils/noOpObj'
import { deepMerge } from '@keg-hub/jsutils/deepMerge'
import { flatUnion } from '@keg-hub/jsutils/flatUnion'
import { noPropArr } from '@keg-hub/jsutils/noPropArr'
import { InternalPaths } from '@gobletqa/environment/constants'
import { findProc, killProc } from '@gobletqa/shared/libs/proc'
import { screencastConfig } from '@GSC/Configs/screencast.config'


/**
 * Cache holder for the tigervnc process
 * @type {Object|undefined}
 */
const defVncArgs = noOpObj as TChildProcArgs

/**
 * Starts tigervnc to allow loading VNC in the browser
 * @param {Object} [args] - options for setting up tigervnc
 * @param {Array} args.args - Arguments to pass to the Xtigervnc command
 * @param {Array} args.cwd - Location where the command should be run
 * @param {Array} args.env - Extra environment variables to pass
 *
 * @example
 * // With auth
 * Xtigervnc -SecurityTypes None -geometry 1024x768x24 -rfbauth /root/.vnc/passwd -rfbport 26370 -alwaysshared :0
 * @example
 * // With arm64 hack
 * LD_PRELOAD=/lib/aarch64-linux-gnu/libgcc_s.so.1 /usr/bin/Xtigervnc -SecurityTypes None -geometry 1024x900x24 -rfbport 26370 -alwaysshared :0
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
    Logger.log(`- Tigervnc already running with pid:`, status.pid)
    return status
  }

  const { vnc } = screencastConfig.screencast

  const cmdArgs = flatUnion(
    [
      `ttyxx`,
      `-verbose`,
      `-SecurityTypes`,
      `None`,
      `-geometry`,
      `${vnc.width}x${vnc.height}x24`,
      `-rfbport`,
      vnc.port,
      `-alwaysshared`,
      vnc.display,
    ],
    args
  )

  const cmdOpts = deepMerge({
    stdio: 'inherit',
    cwd: cwd || InternalPaths.gobletRoot,
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
  }, options, { env })

  const cmd = `Xtigervnc ${cmdArgs.join(' ')}`
  Logger.info(`Starting TigerVnc server`, { cmd })

  return exec(cmd, cmdOpts)

}

/**
 * Gets the status of the tiger vnc server
 *
 * @returns {Object} - Status of the tiger vnc process
 */
export const statusVNC = async () => {
  const [_, status] = await limbo<TProc>(findProc('Xtigervnc'))
  return status
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
