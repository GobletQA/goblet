import { error } from '@keg-hub/cli-utils'
import { getDeployContext } from '../helpers/contexts'

/**
 * Builds the labels to add to the docker image
 */
export const getDockerLabels = (docFileCtx:string, env:string) => {
  const dockerLabel = getDeployContext(docFileCtx, env)

  return dockerLabel
    ? [`--label`, dockerLabel]
    : error.throwError(`Could not find docker label for context "${docFileCtx}"`)
}
