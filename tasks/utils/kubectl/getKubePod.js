const { noOpObj } = require('@keg-hub/jsutils')
const { error } = require('@keg-hub/cli-utils')
const { getKubePods } = require('../kubectl/getKubePods')
const { getDeployContext } = require('../helpers/contexts')

/**
 * Finds a single pod based on the pods metadata labels
 * Returns the first found pod, where a label value matches the passed in context
 * @param {Object} params - Passed in options, converted into an object
 *
 * @return {Object} - Found pod object or undefined
 */
const getKubePod = async (params = noOpObj) => {
  const { context, env } = params
  !context && error.throwError(`The context param is required to find a pod`)

  const match = getDeployContext(context, env)

  !match &&
    error.throwError(`Can not match a pod to non-existing match argument ${context}`)

  const { items } = await getKubePods(params)

  return items.find((item) =>
    Object.values(item.metadata.labels)
      .map((val) => val.toLowerCase().trim())
      .includes(match.toLowerCase().trim())
  )
}

module.exports = {
  getKubePod,
}
