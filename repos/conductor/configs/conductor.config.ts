import type { DockerOptions } from 'dockerode'
import fs from 'node:fs'
import { inDocker } from '@keg-hub/cli-utils'
import { toNum, toBool, exists } from '@keg-hub/jsutils'
import { loadEnvs } from '@gobletqa/shared/utils/loadEnvs'
import { DEF_HOST_IP } from '@gobletqa/conductor/constants/constants'
import {
  TDockerConfig,
  TProxyConfig,
  TServerConfig,
  TConductorConfig
} from '@gobletqa/conductor/types'


const isDocker = inDocker()
const isKube = isDocker && exists(process.env.KUBERNETES_SERVICE_HOST)

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
  GOBLET_DIND_SERVICE_HOST,
  GOBLET_DIND_SERVICE_PORT,
  
  // TODO: rename these so they are not backend specific
  GB_BE_JWT_EXP,
  GB_BE_JWT_ALGO,
  GB_BE_JWT_SECRET,
  GB_BE_JWT_CREDENTIALS,
  GB_BE_JWT_REFRESH_EXP,
  GB_BE_JWT_REFRESH_SECRET,

  GB_VALIDATION_KEY,
  GB_VALIDATION_HEADER,

  GB_VNC_ACTIVE,

  GB_DD_CADDY_HOST,
  GB_DD_DEPLOYMENT,
  GB_DD_EXP_ADMIN_PORT,
  GB_DD_LOCAL_ADMIN_PORT,

  GB_CD_LOCAL_DEV_MODE,
  // Salting the user hash string. Not intended to be secure, just anonymous
} = process.env


/**
 * Helper to resolve the host for docker and caddy
 */
const getDinDHost = () => {
  return !isKube
    ? GB_DD_CADDY_HOST
    : exists(GB_DD_DEPLOYMENT)
      ? GB_DD_DEPLOYMENT
      : exists(GOBLET_DIND_SERVICE_HOST)
        ? GOBLET_DIND_SERVICE_HOST
        : GB_DD_CADDY_HOST
}
const dindHost = getDinDHost()

/**
 * Helper to generate the options for connecting to the controller (i.e. docker)
 */
const getControllerOpts = () => {
  const opts:DockerOptions = !isDocker
    ? {}
    : dindHost && GOBLET_DIND_SERVICE_PORT
      ? { host: dindHost, port: GOBLET_DIND_SERVICE_PORT, protocol: `http` }
      : { socketPath: GB_CD_DOC_VOLUMES }

  return opts
}

const getCaddyOpts = (dindOpts:DockerOptions) => {
  const url = dindOpts.host
      ? `${dindOpts.protocol}://${dindOpts.host}:${GB_DD_EXP_ADMIN_PORT}`
      : isDocker
        ? `http://${GB_DD_CADDY_HOST}:${GB_DD_EXP_ADMIN_PORT}`
        : `http://${GB_DD_CADDY_HOST}:${GB_DD_LOCAL_ADMIN_PORT}`

  return {
    url,
    host: dindHost,
    headers: {
      host: GB_CD_HOST,
      'content-type': `application/json`,
      [GB_VALIDATION_HEADER]: GB_VALIDATION_KEY
    }
  }
}

const dindOpts = getControllerOpts()

export const conductorConfig:TConductorConfig = {
  caddy: getCaddyOpts(dindOpts),
  screencast: {
    active: toBool(GB_VNC_ACTIVE),
  },
  controller: {
    options: dindOpts,
    pidsLimit: toNum(GB_CD_PIDS_LIMIT) as number,
  } as TDockerConfig,
  proxy: {
    host: GB_CD_HOST,
    hashKey: GB_CD_HASH_KEY,
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
    auth: true,
    validation: {
      key: GB_VALIDATION_KEY,
      keyHeader: GB_VALIDATION_HEADER,
    },
    jwt: {
      exp: GB_BE_JWT_EXP,
      secret: GB_BE_JWT_SECRET,
      refreshExp: GB_BE_JWT_REFRESH_EXP,
      refreshSecret: GB_BE_JWT_REFRESH_SECRET,
      algorithms: [GB_BE_JWT_ALGO || 'HS256'],
      credentialsRequired: toBool(GB_BE_JWT_CREDENTIALS || true),
    }
  } as TServerConfig,

  /**
   * Only turn on local dev mode when explicitly defined, and in a local environment
   */
  localDevMode: nodeEnv === 'local' && Boolean(GB_CD_LOCAL_DEV_MODE === 'true'),
}