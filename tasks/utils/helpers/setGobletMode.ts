import type { TTaskParams } from '../../types'

const { exists } = require('@keg-hub/jsutils')
const { setVncENV } = require('@gobletqa/screencast/libs/utils/vncActiveEnv')

// TODO: Setup custom ENVs to pull from the values files
const vncEnvs = {
  // Add custom envs for the VNC environment
}

const mountEnvs = {
  // Add custom envs for the local environment
}

/**
 * Sets the mode that goblet will be run in
 * Then calls methods to set the proper envs
 * @returns {string} - Mode that goblet is running in
 */
export const setGobletMode = (params:TTaskParams) => {
  const { launch, local, vnc } = params
  const mode = params.mode || (vnc && 'vnc') || (local && 'local') || undefined

  const gobletMode = exists(mode)
    ? mode
    : !exists(launch) || launch
    ? 'local'
    : 'vnc'
  const vncActive = gobletMode === 'vnc' ? true : false

  setVncENV(vncActive)

  return gobletMode
}
