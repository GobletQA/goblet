
import '../resolveRoot'
import type { TBackendConfig } from '@GBE/types'
import { ENVS } from '@gobletqa/environment'

import { conductorConfig } from './conductor.config'
import { deepMerge } from '@keg-hub/jsutils/deepMerge'
import { loadEnvs } from '@gobletqa/shared/utils/loadEnvs'
import { getKindHost } from '@gobletqa/conductor/utils/getKindHost'
import { getDindHost } from '@gobletqa/conductor/utils/getDindHost'
import { generateOrigins } from '@gobletqa/shared/api/origin/generateOrigins'

const nodeEnv = ENVS.NODE_ENV || `local`
loadEnvs({
  force: true,
  locations: [],
  name: `goblet`,
  override: nodeEnv === 'local'
})

const isDockerHost = (ENVS.GB_CD_CONTROLLER_TYPE || ``).toLowerCase() === `docker`
const controllerHost = isDockerHost
  ? getDindHost()
  : getKindHost()

const buildBackendConf = () => {
  return isDockerHost
    ? {
        vncProxy: {
          port: ENVS.GB_DD_VNC_PROXY_PORT,
        },
        wsProxy: {
          port: ENVS.GB_DD_WS_PROXY_PORT,
        },
        debugProxy: {
          port: ENVS.GB_DT_REMOTE_DEBUG_PORT
        },
        devtoolsProxy: {
          port: ENVS.GB_DT_PROXY_PORT
        }
      }
    : {
        vncProxy: {
          port: ENVS.GB_KD_VNC_PROXY_PORT,
        },
        wsProxy: {
          port: ENVS.GB_KD_WS_PROXY_PORT,
        },
        debugProxy: {
          port: ENVS.GB_DT_REMOTE_DEBUG_PORT
        },
        devtoolsProxy: {
          port: ENVS.GB_DT_PROXY_PORT
        }
      }
}


export const backendConfig:TBackendConfig = deepMerge<TBackendConfig>({
  server: {
    auth: true,
    port: ENVS.GB_BE_PORT,
    host: ENVS.GB_BE_HOST,
    environment: nodeEnv,
    path: ENVS.GB_BE_WS_PATH,
    logLevel: ENVS.GB_LOG_LEVEL,
    securePort: ENVS.GB_BE_SECURE_PORT,
    origins: generateOrigins(ENVS.GB_SERVER_ORIGINS),
    jwt: {
      exp: ENVS.GB_BE_JWT_EXP,
      secret: ENVS.GB_BE_JWT_SECRET,
      algorithms: [ENVS.GB_BE_JWT_ALGO],
      refreshExp: ENVS.GB_BE_JWT_REFRESH_EXP,
      refreshSecret: ENVS.GB_BE_JWT_REFRESH_SECRET,
      credentialsRequired: ENVS.GB_BE_JWT_CREDENTIALS,
    }
  },
  conductor: conductorConfig,
  vncProxy: {
    host: controllerHost,
    path: ENVS.GB_NO_VNC_PATH,
    protocol: ENVS.GB_NO_VNC_PROTOCOL,
    headers: {
      [ENVS.GB_CD_VALIDATION_HEADER]: ENVS.GB_CD_VALIDATION_KEY
    }
  },
  wsProxy: {
    host: controllerHost,
    path: ENVS.GB_BE_WS_PATH,
    protocol: ENVS.GB_BE_WS_PROTOCOL,
    headers: {
      [ENVS.GB_CD_VALIDATION_HEADER]: ENVS.GB_CD_VALIDATION_KEY
    }
  },
  debugProxy: {
    host: controllerHost,
    path: ENVS.GB_BE_WS_DEBUG_PATH,
    protocol: ENVS.GB_BE_WS_PROTOCOL,
    headers: {
      [ENVS.GB_CD_VALIDATION_HEADER]: ENVS.GB_CD_VALIDATION_KEY
    }
  },
  devtoolsProxy: {
    host: controllerHost,
    path: ENVS.GB_BE_WS_DEBUG_PATH,
    protocol: ENVS.GB_BE_WS_PROTOCOL,
    headers: {
      [ENVS.GB_CD_VALIDATION_HEADER]: ENVS.GB_CD_VALIDATION_KEY
    }
  }
}, buildBackendConf())
