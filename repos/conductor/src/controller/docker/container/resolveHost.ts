import type { Docker } from '../docker'
import { inDocker } from '@keg-hub/cli-utils'

const isDocker = inDocker()

/**
 * Resolves the host where the session container is running
 * We use docker in docker, so typically it will just be `goblet-dind`,
 * But this needs to be validated
 * TODO: Validate this is working properly. May be better to use IP of the docker container
 * Or just use the goblet dind deployment
 * container?.NetworkSettings?.Node?.IP || `goblet-dind`,
 */
export const resolveHost = (controller:Docker) => {
  const { host:dockerHost } = controller?.config?.options

  return !isDocker || !dockerHost || dockerHost.includes(`docker.sock`)
    ? controller?.conductor?.config?.domain
    : dockerHost
}