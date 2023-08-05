import { exists, toBool } from '@keg-hub/jsutils/node'
import { inDocker } from '@keg-hub/jsutils/src/node/inDocker'

// TODO: fix this - inDocker is no longer working due to recent updates
// Can no longer depend on it
const isDocker = inDocker()
const isKube = isDocker && exists(process.env.KUBERNETES_SERVICE_HOST)

/**
 * Gets the values for the vnc env and socket env
 */
export const checkVncEnv = () => ({
  isKube,
  isDocker: !isKube && isDocker,
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

  return vncActive
}

