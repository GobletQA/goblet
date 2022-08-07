const { error } = require('@keg-hub/cli-utils')
const { getContext } = require('../helpers/contexts')
const { resolveContext } = require('../kubectl/resolveContext')

/**
 * Finds the correct image name to use based on the params and docFileCtx
 * @param {Object} params - Passed in task options, converted into an object
 * @param {string} docFileCtx - Context of the Dockerfile to use
 * @param {Object} envs - ENV values loaded from the values.yml files
 
 * @return {string} - Resolved name of the docker image
 */
const resolveImgName = (params, docFileCtx, envs) => {
  const shortContext = getContext(docFileCtx)?.short

  // Get the name of the image that will be built
  const imgName =
    params.image ||
    (docFileCtx && envs[`GB_${docFileCtx.toUpperCase()}_IMAGE`]) ||
    (shortContext && envs[`GB_${shortContext.toUpperCase()}_IMAGE`]) ||
    resolveContext(
      docFileCtx,
      {
        fe: envs.GB_FE_IMAGE,
        be: envs.GB_BE_IMAGE,
        cd: envs.GB_CD_IMAGE,
        sc: envs.GB_SC_IMAGE,
        px: envs.GB_PX_IMAGE,
        db: envs.GB_DB_IMAGE,
        bs: envs.GB_IMAGE_FROM,
      },
      envs.IMAGE
    )

  !imgName &&
    error.throwError(
      `The image argument or IMAGE env must exist to build the docker image`
    )

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
