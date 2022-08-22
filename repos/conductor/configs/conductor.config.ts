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
  GB_CD_HASH_KEY,
  GB_CD_SUB_DOMAIN,

  GB_CD_PIDS_LIMIT,
  GB_CD_RATE_LIMIT,
  GOBLET_DIND_SERVICE_HOST,
  GOBLET_DIND_SERVICE_PORT,

  GB_DD_VALIDATION_KEY,
  GB_DD_VALIDATION_HEADER,

  GB_DD_PROXY_PORT,
  GB_DD_CADDY_HOST,
  GB_DD_DEPLOYMENT,

  // In dev running screen-cast as it's own deployment
  GB_SC_DEPLOYMENT,
  // Salting the user hash string. Not intended to be secure, just anonymous
} = process.env

/**
 * Helper to resolve the host for docker and the proxy
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

/**
 * Helper to generate the options for connecting to the controller (i.e. docker)
 */
const getControllerOpts = () => {
  const opts:DockerOptions = !isDocker
    ? {}
    : { host: dindHost, port: GOBLET_DIND_SERVICE_PORT, protocol: `http` }

  return opts
}

const proxyOpts = (dindOpts:DockerOptions, dindHost:string) => {
  const proto = dindOpts?.protocol || (GB_DD_PROXY_PORT === `443` ? `https` : `http`)
  return {
    port: GB_DD_PROXY_PORT,
    target: `${proto}://${dindHost}:${GB_DD_PROXY_PORT}`,
    headers: {
      'content-type': `application/json`,
      [GB_DD_VALIDATION_HEADER]: GB_DD_VALIDATION_KEY
    }
  }
}

const dindHost = getDinDHost()
const dindOpts = getControllerOpts()

export const conductorConfig:TConductorConfig = {
  domain: GB_CD_HOST,
  altDomain: GB_SC_DEPLOYMENT,
  subdomain: GB_CD_SUB_DOMAIN,
  hashKey: GB_CD_HASH_KEY || ``,
  proxy: proxyOpts(dindOpts, dindHost),
  controller: {
    devRouter: {},
    options: dindOpts,
    pidsLimit: toNum(GB_CD_PIDS_LIMIT) as number,
    rateLimit: (toNum(GB_CD_RATE_LIMIT) || 5000) as number,
  } as TDockerConfig
}