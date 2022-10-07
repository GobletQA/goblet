
import '../resolveRoot'
import { toBool, deepMerge } from '@keg-hub/jsutils'
import { TKindConfig } from '../src/types'
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
  GB_KD_PORT,
  GB_KD_HOST,
  GB_KD_WS_PATH,
  GB_KD_SECURE_PORT,
  
  GB_LOG_LEVEL,
  GB_SERVER_ORIGINS,

  GB_BE_JWT_EXP,
  GB_BE_JWT_ALGO,
  GB_BE_JWT_SECRET,
  GB_BE_JWT_CREDENTIALS,
  GB_BE_JWT_REFRESH_EXP,
  GB_BE_JWT_REFRESH_SECRET,

  GB_CD_CONTROLLER_TYPE,
  GB_KD_VALIDATION_KEY,
  GB_KD_VALIDATION_HEADER,

  GB_KD_WS_PROXY_PORT,
  GB_KD_VNC_PROXY_PORT,
  GB_KUBE_NAMESPACE='default',

} = process.env


export const config:TKindConfig = {
  server: {
    auth: true,
    port: GB_KD_PORT,
    host: GB_KD_HOST,
    environment: nodeEnv,
    path: GB_KD_WS_PATH,
    logLevel: GB_LOG_LEVEL,
    securePort: GB_KD_SECURE_PORT,
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
  kubectl: {
    namespace: GB_KUBE_NAMESPACE
  }
}