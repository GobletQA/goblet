import { kubectl } from './kubectl'
import { noOpObj, parseJSON } from '@keg-hub/jsutils'

/**
 * Runs kubectl get pods command, and converts the respond into a JSON object
 * @param {Object} params - Passed in options, converted into an object
 *
 * @return {Object} - JSON object of the currently running pods
 */
export const getKubePods = async (params:Record<any, any> = noOpObj) => {
  const data = await kubectl([`get`, `pods`, `-o`, `json`], { ...params, exec: true })

  return parseJSON(data, false)
}
