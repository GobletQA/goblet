import type { DockerOptions } from 'dockerode'
import { inDocker } from '@keg-hub/cli-utils'
import { toNum, exists } from '@keg-hub/jsutils'
import { loadEnvs } from '@gobletqa/shared/utils/loadEnvs'
import { TDockerConfig, TConductorConfig } from '@gobletqa/conductor/types'

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
  GB_CD_HOST,
  GB_CD_PIDS_LIMIT,
  GB_CD_RATE_LIMIT,
  GOBLET_DIND_SERVICE_HOST,
  GOBLET_DIND_SERVICE_PORT,

  GB_VALIDATION_KEY,
  GB_VALIDATION_HEADER,

  GB_DD_CADDY_HOST,
  GB_DD_DEPLOYMENT,
  GB_DD_EXP_ADMIN_PORT,
  GB_DD_LOCAL_ADMIN_PORT,

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
    : { host: dindHost, port: GOBLET_DIND_SERVICE_PORT, protocol: `http` }

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
  controller: {
    options: dindOpts,
    pidsLimit: toNum(GB_CD_PIDS_LIMIT) as number,
    rateLimit: (toNum(GB_CD_RATE_LIMIT) || 5000) as number,
  } as TDockerConfig
}