
import '../resolveRoot'
import path from 'path'
import { toBool } from '@keg-hub/jsutils'
import { TBackendConfig } from '@GBE/types'
import { sockrCmds } from './sockrCmds.config'
import { aliases } from '@GConfigs/aliases.config'
import { conductorConfig } from './conductor.config'
import { loadEnvs } from '@gobletqa/shared/utils/loadEnvs'
import { generateOrigins } from '@gobletqa/shared/utils/generateOrigins'
import { getDindHost } from '@gobletqa/shared/utils/getDindHost'

const nodeEnv = process.env.NODE_ENV || `local`
loadEnvs({
  force: true,
  locations: [],
  name: `goblet`,
  override: nodeEnv === 'local'
})

const {
  GB_LOG_LEVEL,
  GB_SERVER_ORIGINS,
  GB_AUTH_ACTIVE,

  GB_BE_SOCKR_PATH,
  GB_BE_SOCKET_PORT,
  GB_BE_SOCKET_HOST,

  GB_BE_PORT,
  GB_BE_HOST,
  GB_BE_SECURE_PORT,

  GB_SC_DEPLOYMENT,
  GB_VNC_ACTIVE,
  GB_NO_VNC_PATH,
  GB_NO_VNC_PORT,
  GB_NO_VNC_PROTOCOL,

  GB_BE_JWT_EXP,
  GB_BE_JWT_ALGO,
  GB_BE_JWT_SECRET,
  GB_BE_JWT_CREDENTIALS,
  GB_BE_JWT_REFRESH_EXP,
  GB_BE_JWT_REFRESH_SECRET,

  GB_BE_COOKIE_SECRET,
  // TODO: @lance-tipton - Remove these defaults. Should come from values files
  GB_BE_COOKIE_KEY,
  GB_BE_COOKIE_NAME,
  GB_BE_COOKIE_SECURE,
  GB_BE_COOKIE_HTTP_ONLY,
  GB_BE_COOKIE_OVERWRITE,
  GB_BE_COOKIE_SAME_SITE,
  GB_BE_COOKIE_MAX_AGE = 12 * 60 * 60 * 1000,
  GB_BE_COOKIE_EXP = new Date(new Date().getTime() + 86400000),

  GB_LOCAL_DEV_MODE,
  GB_DD_PROXY_PORT,
  GOBLET_DIND_SERVICE_PORT
} = process.env

const dindHost = getDindHost()

export const backendConfig:TBackendConfig  = {
  server: {
    port: GB_BE_PORT,
    host: GB_BE_HOST,
    environment: nodeEnv,
    path: GB_BE_SOCKR_PATH,
    logLevel: GB_LOG_LEVEL,
    auth: toBool(GB_AUTH_ACTIVE),
    securePort: GB_BE_SECURE_PORT,
    origins: generateOrigins(GB_SERVER_ORIGINS),
    cookie: {
      key: GB_BE_COOKIE_KEY,
      name: GB_BE_COOKIE_NAME,
      expires: GB_BE_COOKIE_EXP as string,
      secret: GB_BE_COOKIE_SECRET,
      maxAge: GB_BE_COOKIE_MAX_AGE as string,
      sameSite: GB_BE_COOKIE_SAME_SITE,
      secure: toBool(GB_BE_COOKIE_SECURE),
      httpOnly: toBool(GB_BE_COOKIE_HTTP_ONLY),
      overwrite: toBool(GB_BE_COOKIE_OVERWRITE),
    },
    jwt: {
      exp: GB_BE_JWT_EXP,
      secret: GB_BE_JWT_SECRET,
      refreshExp: GB_BE_JWT_REFRESH_EXP,
      refreshSecret: GB_BE_JWT_REFRESH_SECRET,
      algorithms: [GB_BE_JWT_ALGO || 'HS256'],
      credentialsRequired: toBool(GB_BE_JWT_CREDENTIALS || true),
    }
  },
  conductor: conductorConfig,
  sockr: {
    ...sockrCmds,
    path: GB_BE_SOCKR_PATH,
    port: GB_BE_SOCKET_PORT || GB_BE_PORT,
    host: GB_BE_SOCKET_HOST || GB_BE_HOST,
    process: {
      root: aliases.GobletRoot,
      debug: Boolean(GB_LOG_LEVEL == 'debug'),
      script: path.join(aliases.GobletRoot, 'scripts/sockr.cmd.sh'),
    },
  },
  screencast: {
    path: GB_NO_VNC_PATH,
    port: GB_NO_VNC_PORT,
    environment: nodeEnv,
    // TODO: Need to add check for running in one container for multiple
    // When in one container, everything should be 0.0.0.0
    // Might be easier to manually modify the hosts file with the routes in single container mode
    host: GB_SC_DEPLOYMENT,
    protocol: GB_NO_VNC_PROTOCOL,
    active: toBool(GB_VNC_ACTIVE)
  },
  vncProxy: {
    host: dindHost,
    path: GB_NO_VNC_PATH,
    protocol: GB_NO_VNC_PROTOCOL,
    port: GB_DD_PROXY_PORT || GOBLET_DIND_SERVICE_PORT
  },
    /**
   * Only turn on local dev mode when explicitly defined, and in a local environment
   */
  localDevMode: nodeEnv === 'local' && Boolean(GB_LOCAL_DEV_MODE === 'true'),
}