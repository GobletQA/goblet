import { noOpObj } from '@keg-hub/jsutils'
import { error } from '@keg-hub/cli-utils'
import { getKubePods } from '../kubectl/getKubePods'
import { getDeployContext } from '../helpers/contexts'

/**
 * Finds a single pod based on the pods metadata labels
 * Returns the first found pod, where a label value matches the passed in context
 * @param {Object} params - Passed in options, converted into an object
 *
 * @return {Object} - Found pod object or undefined
 */
export const getKubePod = async (params:Record<any, any> = noOpObj) => {
  const { context, env } = params
  !context && error.throwError(`The context param is required to find a pod`)

  const match = getDeployContext(context, env)

  !match &&
    error.throwError(`Can not match a pod to non-existing match argument ${context}`)

  const { items } = await getKubePods(params)

  return items.find((item) =>
    Object.values(item.metadata.labels)
      .map((val) => (val as string).toLowerCase().trim())
      .includes(match.toLowerCase().trim())
  )
}
