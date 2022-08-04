const { loadEnvs } = require('../envs/loadEnvs')
const { noOpObj } = require('@keg-hub/jsutils')
const { resolveContext } = require('../kubectl/resolveContext')

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

  return resolveContext(
    docFileCtx,
    {
      be: envs.GB_BE_IMAGE_TAG,
      fe: envs.GB_FE_IMAGE_TAG,
      cd: envs.GB_CD_IMAGE_TAG,
      sc: envs.GB_SC_IMAGE_TAG,
      px: envs.GB_PX_IMAGE_TAG,
      db: envs.GB_DB_IMAGE_TAG,
    },
    envs.IMAGE_TAG
  )
}

module.exports = {
  getEnvImgTag,
}
