const { error } = require('@keg-hub/cli-utils')
const { getContextValue } = require('../helpers/contexts')

/**
 * Finds the correct image name to use based on the params and docFileCtx
 * @param {Object} params - Passed in task options, converted into an object
 * @param {string} docFileCtx - Context of the Dockerfile to use
 * @param {Object} envs - ENV values loaded from the values.yml files
 
 * @return {string} - Resolved name of the docker image
 */
const resolveImgName = (params, docFileCtx, envs) => {

  // Get the name of the image that will be built
  let imgName = params.image || getContextValue(docFileCtx, envs, `IMAGE`, envs.IMAGE)

  !imgName &&
    error.throwError(`Could not find image or IMAGE env for context "${docFileCtx}"`)

  // Ensure the image tag is removed
  imgName = imgName.indexOf(`:`) ? imgName.split(`:`).shift() : imgName

  // If it has a /, then it's a full image url, so just return it
  if (imgName.includes(`/`)) return imgName

  // Try to find the image registry to use
  const registry = params.registry
    || envs.DOCKER_REGISTRY
    || envs.IMAGE.split('/').shift()

  // If there's a registry, add it to the image name
  // Otherwise just return the image name
  return registry
    ? path.join(registry, imgName)
    : imgName
}

module.exports = {
  resolveImgName,
}
