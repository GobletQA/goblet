import { kubectl } from './kubectl'
import { error } from '@keg-hub/cli-utils'
import { noOpObj, isNum } from '@keg-hub/jsutils'
import { getDeployContext } from '../helpers/contexts'

/**
 * Scales a deployments replicas up or down based on passed in params
 * Returns the first found pod, where a label value matches the passed in context
 * @param {Object} params - Passed in options, converted into an object
 *
 * @return {Object} - Found pod object or undefined
 */
export const scaleKubeDeployment = async (params:Record<any, any> = noOpObj) => {
  const { amount, context, env } = params

  !context &&
    error.throwError(`The deployment context param is required to scale a deployment`)
  !isNum(amount) && error.throwError(`The amount param is required to scale a deployment`)

  const deployment = getDeployContext(context, env)

  !deployment && error.throwError(`Can not find deployment for context "${context}"`)

  return await kubectl([`scale`, `deploy`, deployment, `--replicas=${amount}`], {
    ...params,
    exec: true,
  })
}
