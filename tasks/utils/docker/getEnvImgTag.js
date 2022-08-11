const { loadEnvs } = require('../envs/loadEnvs')
const { noOpObj } = require('@keg-hub/jsutils')
const { error } = require('@keg-hub/cli-utils')
const { getContextValue } = require('../helpers/contexts')

/**
 * Gets tag of an image set in the value file for the env
 * @export
 * @param {Object} params - Passed in task options, converted into an object
 * @param {Object} envs - Key/Value pairs of envs loaded from the values files
 *
 * @return {Object} - Resolved tagging option values
 */
const getEnvImgTag = async (params = noOpObj, docFileCtx = ``, envs) => {
  envs = envs || loadEnvs({ env: params.env })
  const imgTag = getContextValue(docFileCtx, envs, `IMAGE_TAG`, envs.IMAGE_TAG)

  return imgTag || error.throwError(`Could not find image tag for context "${docFileCtx}"`)
}

module.exports = {
  getEnvImgTag,
}
