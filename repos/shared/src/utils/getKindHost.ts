import { exists } from '@keg-hub/jsutils'
import { inDocker } from '@keg-hub/cli-utils'

/**
 * Helper to resolve the host for docker and the proxy
 */
export const getKindHost = () => {
  const {
    GB_KD_HOST,
    GB_KD_DEPLOYMENT,
    KUBERNETES_SERVICE_HOST,
    GOBLET_KIND_SERVICE_HOST
  } = process.env

  const isDocker = inDocker()
  const isKube = isDocker && exists(KUBERNETES_SERVICE_HOST)

  return !isKube
      ? GB_KD_HOST
      : exists(GB_KD_DEPLOYMENT)
        ? GB_KD_DEPLOYMENT
        : exists(GOBLET_KIND_SERVICE_HOST)
          ? GOBLET_KIND_SERVICE_HOST
          : GB_KD_HOST

}