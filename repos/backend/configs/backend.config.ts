
import '../resolveRoot'
import { TBackendConfig } from '@GBE/types'
import { toBool, deepMerge } from '@keg-hub/jsutils'
import { conductorConfig } from './conductor.config'
import { loadEnvs } from '@gobletqa/shared/utils/loadEnvs'
import { getDindHost } from '@gobletqa/shared/utils/getDindHost'
import { getKindHost } from '@gobletqa/shared/utils/getKindHost'
import { generateOrigins } from '@gobletqa/shared/utils/generateOrigins'

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

  GB_BE_WS_PATH,
  GB_BE_WS_PROTOCOL,
  GB_DD_WS_PROXY_PORT,

  GB_BE_PORT,
  GB_BE_HOST,
  GB_BE_SECURE_PORT,

  GB_NO_VNC_PATH,
  GB_NO_VNC_PROTOCOL,
  GB_DD_VNC_PROXY_PORT,

  GB_BE_JWT_EXP,
  GB_BE_JWT_ALGO,
  GB_BE_JWT_SECRET,
  GB_BE_JWT_CREDENTIALS,
  GB_BE_JWT_REFRESH_EXP,
  GB_BE_JWT_REFRESH_SECRET,

  GB_CD_CONTROLLER_TYPE,
  GB_CD_VALIDATION_KEY,
  GB_CD_VALIDATION_HEADER,
  GB_KD_WS_PROXY_PORT,
  GB_KD_VNC_PROXY_PORT,

} = process.env

const isDockerHost = (GB_CD_CONTROLLER_TYPE || ``).toLowerCase() === `docker`
const controllerHost = isDockerHost
  ? getDindHost()
  : getKindHost()

const buildBackendConf = () => {
  return isDockerHost
    ? {
        vncProxy: {
          port: GB_DD_VNC_PROXY_PORT,
        },
        wsProxy: {
          port: GB_DD_WS_PROXY_PORT,
        }
      }
    : {
        vncProxy: {
          port: GB_KD_VNC_PROXY_PORT,
        },
        wsProxy: {
          port: GB_KD_WS_PROXY_PORT,
        }
      }
}


export const backendConfig:TBackendConfig = deepMerge<TBackendConfig>({
  server: {
    auth: true,
    port: GB_BE_PORT,
    host: GB_BE_HOST,
    environment: nodeEnv,
    path: GB_BE_WS_PATH,
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
  conductor: conductorConfig,
  vncProxy: {
    host: controllerHost,
    path: GB_NO_VNC_PATH,
    protocol: GB_NO_VNC_PROTOCOL,
    headers: {
      [GB_CD_VALIDATION_HEADER]: GB_CD_VALIDATION_KEY
    }
  },
  wsProxy: {
    host: controllerHost,
    path: GB_BE_WS_PATH,
    protocol: GB_BE_WS_PROTOCOL,
    headers: {
      [GB_CD_VALIDATION_HEADER]: GB_CD_VALIDATION_KEY
    }
  }
}, buildBackendConf())
