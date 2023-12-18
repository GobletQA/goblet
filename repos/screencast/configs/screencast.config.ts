import type { TCmdGroups, TGScreencastConfig } from '@GSC/types'

import '../resolveRoot'
import path from 'path'
import { ENVS } from '@gobletqa/environment'
import { toNum } from '@keg-hub/jsutils/toNum'
import { toBool } from '@keg-hub/jsutils/toBool'
import { socketCmds } from './socketCmds.config'
import { aliases } from '@gobletqa/configs/aliases.config'
import { loadEnvs, generateOrigins } from '@gobletqa/shared/api'

const nodeEnv = process.env.NODE_ENV || `local`
loadEnvs({
  force: true,
  locations: [],
  name: `goblet`,
  override: nodeEnv === 'local'
})

// TODO: convert this to use ENVS
const {
  DISPLAY,
  GB_SC_PORT,
  GB_SC_HOST,
  GB_VNC_ACTIVE,
  GB_NO_VNC_PORT,
  GB_NO_VNC_HOST,

  GB_VNC_VIEW_WIDTH,
  GB_VNC_VIEW_HEIGHT,
  GB_VNC_SERVER_PORT,
  GB_VNC_SERVER_HOST,

  GB_LOG_LEVEL,
  GB_SERVER_ORIGINS,

  GB_BE_SECURE_PORT,
  GB_BE_JWT_EXP,
  GB_BE_JWT_ALGO,
  GB_BE_JWT_SECRET,
  GB_BE_JWT_CREDENTIALS,
  GB_BE_JWT_REFRESH_EXP,
  GB_BE_JWT_REFRESH_SECRET,

  GB_SC_WS_PATH,

  // Set defaults to ensure the container dies if not being used
  GB_SC_IDLE_INTERVAL,
  GB_SC_IDLE_THRESHOLD,
  GB_SC_IDLE_WAIT_TO_START,
  GB_SC_IDLE_TIMEOUT_ACTIVE,
  GB_SC_IDLE_CONNECTION_THRESHOLD,

  // TODO Add these envs as a header for request validation
  // This will ensure requests are coming from the backend API only
  GB_CD_VALIDATION_KEY,
  GB_CD_VALIDATION_HEADER,

} = ENVS

export const screencastConfig:TGScreencastConfig = {
  // Uses to start separate screencast API
  server: {
    auth: true,
    port: GB_SC_PORT,
    host: GB_SC_HOST,
    environment: nodeEnv,
    logLevel: GB_LOG_LEVEL,
    securePort: GB_BE_SECURE_PORT,
    origins: generateOrigins(GB_SERVER_ORIGINS),
    jwt: {
      exp: GB_BE_JWT_EXP,
      secret: GB_BE_JWT_SECRET,
      refreshExp: GB_BE_JWT_REFRESH_EXP,
      refreshSecret: GB_BE_JWT_REFRESH_SECRET,
      algorithms: [GB_BE_JWT_ALGO || 'HS256'],
      credentialsRequired: toBool(GB_BE_JWT_CREDENTIALS || true),
    }
  },
  container: {
    inactiveThreshold: toNum(GB_SC_IDLE_THRESHOLD),
    inactiveTimeout:  toNum(GB_SC_IDLE_INTERVAL) * 1000,
    idleWaitToStart:toNum(GB_SC_IDLE_WAIT_TO_START) * 1000,
    connectionThreshold: toNum(GB_SC_IDLE_CONNECTION_THRESHOLD),
    timeoutActive: toBool(GB_SC_IDLE_TIMEOUT_ACTIVE || nodeEnv !== `local`),
  },
  screencast: {
    // Set if the screencast is active or not
    active: toBool(GB_VNC_ACTIVE),
    novnc: {
      host: GB_NO_VNC_HOST,
      port: GB_NO_VNC_PORT,
    },
    vnc: {
      display: DISPLAY,
      host: GB_VNC_SERVER_HOST,
      port: GB_VNC_SERVER_PORT,
      width: GB_VNC_VIEW_WIDTH,
      height: GB_VNC_VIEW_HEIGHT,
    },
  },
  socket: {
    port: GB_SC_PORT,
    host: GB_SC_HOST,
    path: GB_SC_WS_PATH,
    groups: socketCmds.groups as TCmdGroups,
    process: {
      root: aliases.GobletRoot,
      debug: Boolean(GB_LOG_LEVEL == 'debug'),
      // TODO: REMOVE THIS
      script: path.join(aliases[`@GSC/scripts`], 'socket.cmd.sh'),
    },
  }
}

