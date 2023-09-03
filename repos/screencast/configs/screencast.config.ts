import type { TCmdGroups, TBrowserConf } from '@GSC/types'
import type { TScreenDims, TGScreencastConfig } from '@gobletqa/screencast/types'
import { ENVS } from '@gobletqa/environment'

import '../resolveRoot'
import path from 'path'
import { toNum } from '@keg-hub/jsutils/toNum'
import { toBool } from '@keg-hub/jsutils/toBool'
import { socketCmds } from './socketCmds.config'
import { aliases } from '@GConfigs/aliases.config'
import { loadEnvs } from '@gobletqa/shared/utils/loadEnvs'
import { generateOrigins } from '@gobletqa/shared/api/generateOrigins'

const nodeEnv = process.env.NODE_ENV || `local`
loadEnvs({
  force: true,
  locations: [],
  name: `goblet`,
  override: nodeEnv === 'local'
})

const {
  DEBUG_FILE,
  PW_DEBUG_FILE,
  GB_SC_HOST,
  GB_VNC_ACTIVE,
  DISPLAY=':0.0',
  GB_SC_PORT,
  GB_NO_VNC_PORT,
  GB_NO_VNC_HOST=GB_SC_HOST,

  GB_VNC_VIEW_HEIGHT,
  GB_VNC_VIEW_WIDTH,
  GB_VNC_SERVER_PORT,
  GB_VNC_SERVER_HOST=GB_SC_HOST,

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
  GB_SC_IDLE_INTERVAL=20,
  GB_SC_IDLE_THRESHOLD=2,
  GB_SC_IDLE_TIMEOUT_ACTIVE,
  GB_SC_IDLE_WAIT_TO_START=120,
  GB_SC_IDLE_CONNECTION_THRESHOLD=2,

  // TODO Add these envs as a header for request validation
  // This will ensure requests are coming from the backend API only
  GB_CD_VALIDATION_KEY,
  GB_CD_VALIDATION_HEADER,

} = process.env


const screenDims:TScreenDims = {
  width: parseInt(GB_VNC_VIEW_WIDTH as string, 10),
  height: parseInt(GB_VNC_VIEW_HEIGHT as string, 10),
}

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
    // Default playwright browser launch settings
    // TODO: add defaults here for Screencast
    browser: {} as TBrowserConf,
    // Default playwright context settings
    context: {
      screen: screenDims,
      viewport: screenDims,
    },
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
      script: path.join(aliases[`@GSC/Scripts`], 'socket.cmd.sh'),
    },
  },
}

