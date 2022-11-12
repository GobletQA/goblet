import { toBool } from '@keg-hub/jsutils'
import { Logger } from '@keg-hub/cli-utils'

/**
 * Gets the values for the vnc env and socket env
 */
export const checkVncEnv = () => ({
  vncActive: toBool(process.env.GB_VNC_ACTIVE),
  socketActive: toBool(process.env.GB_PW_SOCKET_ACTIVE),
})

/**
 * Adds and removes envs from the current process
*/
export const envUpdates = (toAdd:string, toRemove:string) => {
  delete process.env[toRemove]
  process.env[toAdd] = (true as unknown as string)
}

/**
 * Sets the envs for using VNC inside docker, or the host machine websocket
 * for displaying the browser
 */
export const setVncENV = (vncActive:boolean) => {

  vncActive
    ? envUpdates(`GB_VNC_ACTIVE`, `GB_PW_SOCKET_ACTIVE`)
    : envUpdates(`GB_PW_SOCKET_ACTIVE`, `GB_VNC_ACTIVE`)

  vncActive
    ? Logger.highlight(`Using`, `VNC in Docker`, `for browser automation`)
    : Logger.info(`Using`, `Host Machine`, `for browser automation`)

  return vncActive
}

