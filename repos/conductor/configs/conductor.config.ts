
import { toNum } from '@keg-hub/jsutils'
import { inDocker } from '@keg-hub/cli-utils'
import { loadEnvs } from '@gobletqa/shared/utils/loadEnvs'
import { DEF_HOST_IP } from '@gobletqa/conductor/constants/constants'
import {
  TDockerConfig,
  TProxyConfig,
  TServerConfig,
  TConductorConfig
} from '@gobletqa/conductor/types'


const isDocker = inDocker()
const nodeEnv = process.env.NODE_ENV || `local`
loadEnvs({
  name: `goblet`,
  force: true,
  locations: [],
  override: nodeEnv === 'local'
})

const {
  GB_CD_PORT,
  GB_CD_SECURE_PORT,
  GB_CD_HOST=DEF_HOST_IP,
  GB_LOG_LEVEL,
  GB_CD_TIMEOUT,
  GB_CD_HASH_KEY,
  GB_CD_LOG_LEVEL=GB_LOG_LEVEL,
  GB_CD_PIDS_LIMIT,
  GB_CD_RATE_LIMIT,
  GB_CD_DOC_VOLUMES,
  GB_CD_SERVER_SECRET,
  GOBLET_DIND_SERVICE_HOST,
  GOBLET_DIND_SERVICE_PORT,
  // Salting the user hash string. Not intended to be secure, just anonymous
} = process.env

/**
 * Helper to generate the options for connecting to the controller (i.e. docker)
 */
const getControllerOpts = () => {
  return !isDocker
    ? {}
    : GOBLET_DIND_SERVICE_HOST && GOBLET_DIND_SERVICE_PORT
      ? { host: GOBLET_DIND_SERVICE_HOST, port: GOBLET_DIND_SERVICE_PORT }
      : { socketPath: GB_CD_DOC_VOLUMES }
}

export const conductorConfig:TConductorConfig = {
  controller: {
    options: getControllerOpts(),
    pidsLimit: toNum(GB_CD_PIDS_LIMIT) as number,
  } as TDockerConfig,
  proxy: {
    host: GB_CD_HOST,
    hashKey: GB_CD_HASH_KEY,
    secret: GB_CD_SERVER_SECRET,
    logLevel: GB_CD_LOG_LEVEL,
    timeout: (toNum(GB_CD_TIMEOUT) || 5000) as number,
    rateLimit: (toNum(GB_CD_RATE_LIMIT) || 5000) as number,
  } as TProxyConfig,
  server: {
    name: `Conductor`,
    host: GB_CD_HOST,
    logLevel: GB_CD_LOG_LEVEL,
    port: (toNum(GB_CD_PORT) || 9901) as number,
    securePort:  (toNum(GB_CD_SECURE_PORT) || 9901) as number,
    rateLimit: (toNum(GB_CD_RATE_LIMIT) || 5000) as number,
  } as TServerConfig,
}