const { devspaceUse } = require('./devspaceUse')
const { get, noOpObj } = require('@keg-hub/jsutils')
const { getKubePod } = require('../kubectl/getKubePod')

/**
 * Checks if devspace is already running, by checking in the pod already exists and is in a Running phase
 * @param {Object} params - Passed in options, converted into an object
 *
 * @return {boolean} - True if the pod is running
 */
const devspaceRunning = async (params = noOpObj) => {
  await devspaceUse(params)
  const pod = await getKubePod({ ...params, context: 'app' })

  return get(pod, `status.phase`) === `Running` ? pod : false
}

module.exports = {
  devspaceRunning,
}
