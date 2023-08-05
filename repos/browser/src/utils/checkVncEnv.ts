import { ENVS } from '@gobletqa/environment'

export const socketActive = () => {
  return ENVS.GB_PW_SOCKET_ACTIVE
}

export const vncActive = () => {
  return ENVS.GB_VNC_ACTIVE
}

export const checkVncEnv = () => ({
  vncActive: ENVS.GB_VNC_ACTIVE,
  socketActive: ENVS.GB_PW_SOCKET_ACTIVE,
})
