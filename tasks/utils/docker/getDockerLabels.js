const { error } = require('@keg-hub/cli-utils')
const { getDeployContext } = require('../helpers/contexts')

/**
 * Builds the labels to add to the docker image
 * @param {string} docFileCtx - Context of the Dockerfile to use
 * @param {string} env - The current environment
 *
 * @returns {Array<string>} - Build labels for the docker image
 */
const getDockerLabels = (docFileCtx, env) => {
  const dockerLabel = getDeployContext(context, env)

  return dockerLabel
    ? [`--label`, dockerLabel]
    : error.throwError(`Could not find docker label for context "${docFileCtx}"`)
}

module.exports = {
  getDockerLabels,
}
