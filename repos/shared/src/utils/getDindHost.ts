import { exists } from '@keg-hub/jsutils'
import { inDocker } from '@keg-hub/cli-utils'

/**
 * Helper to resolve the host for docker and the proxy
 */
export const getDindHost = () => {
  const {
    GB_DD_CADDY_HOST,
    GB_DD_DEPLOYMENT,
    KUBERNETES_SERVICE_HOST,
    GOBLET_DIND_SERVICE_HOST
  } = process.env

  const isDocker = inDocker()
  const isKube = isDocker && exists(KUBERNETES_SERVICE_HOST)

  return !isKube
      ? GB_DD_CADDY_HOST
      : exists(GB_DD_DEPLOYMENT)
        ? GB_DD_DEPLOYMENT
        : exists(GOBLET_DIND_SERVICE_HOST)
          ? GOBLET_DIND_SERVICE_HOST
          : GB_DD_CADDY_HOST

}