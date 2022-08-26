import '../resolveRoot'
import path from 'path'

import { toBool } from '@keg-hub/jsutils'
import { sockrCmds } from './sockrCmds.config'
import { aliases } from '@GConfigs/aliases.config'
import { loadEnvs } from '@gobletqa/shared/utils/loadEnvs'
import { generateOrigins } from '@gobletqa/shared/utils/generateOrigins'
import { TScreenDims, TGScreencastConfig } from '@gobletqa/screencast/src/types'

const nodeEnv = process.env.NODE_ENV || `local`
loadEnvs({
  force: true,
  locations: [],
  name: `goblet`,
  override: nodeEnv === 'local'
})

const {
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
  GB_AUTH_ACTIVE,
  GB_SERVER_ORIGINS,

  GB_BE_SECURE_PORT,
  GB_BE_JWT_EXP,
  GB_BE_JWT_ALGO,
  GB_BE_JWT_SECRET,
  GB_BE_JWT_CREDENTIALS,
  GB_BE_JWT_REFRESH_EXP,
  GB_BE_JWT_REFRESH_SECRET,


  GB_BE_SOCKR_PATH,
  GB_SC_SOCKR_PATH=GB_BE_SOCKR_PATH,
  GB_SC_SOCKET_PORT=GB_SC_PORT,
  GB_SC_SOCKET_HOST=GB_SC_HOST,

  // TODO Add these envs as a header for request validation
  // This will ensure requests are coming from the backend API only
  GB_DD_VALIDATION_KEY,
  GB_DD_VALIDATION_HEADER,

} = process.env

const screenDims:TScreenDims = {
  width: parseInt(GB_VNC_VIEW_WIDTH as string, 10) ?? 900,
  height: parseInt(GB_VNC_VIEW_HEIGHT as string, 10) ?? 1440,
}

export const screencastConfig:TGScreencastConfig = {
  // Uses to start separate screencast API
  server: {
    port: GB_SC_PORT,
    host: GB_SC_HOST,
    environment: nodeEnv,
    logLevel: GB_LOG_LEVEL,
    auth: toBool(GB_AUTH_ACTIVE),
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
  screencast: {
    // Set if the screencast is active or not
    active: toBool(GB_VNC_ACTIVE),
    // Default playwright browser launch settings
    // TODO: add defaults here for Screencast
    browser: {},
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
  sockr: {
    ...sockrCmds,
    path: GB_SC_SOCKR_PATH || GB_SC_PORT,
    port: GB_SC_SOCKET_PORT,
    host: GB_SC_SOCKET_HOST,
    process: {
      root: aliases.GobletRoot,
      debug: Boolean(GB_LOG_LEVEL == 'debug'),
      script: path.join(aliases[`@GSC/Scripts`], 'sockr.cmd.sh'),
    },
  },
}

