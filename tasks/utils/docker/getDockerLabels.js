const { resolveContext } = require('../kubectl/resolveContext')

/**
 * Builds the labels to add to the docker image
 * @param {string} docFileCtx - Context of the Dockerfile to use
 * @param {Object} envs - ENV values loaded from the values.yml files
 *
 * @returns {Array<string>} - Build labels for the docker image
 */
const getDockerLabels = (docFileCtx, envs) => {
  return [
    `--label`,
    resolveContext(
      docFileCtx,
      {
        fe: envs.GB_FE_DEPLOYMENT,
        be: envs.GB_BE_DEPLOYMENT,
        cd: envs.GB_CD_DEPLOYMENT,
        sc: envs.GB_SC_DEPLOYMENT,
        px: envs.GB_PX_DEPLOYMENT,
        db: envs.GB_DB_DEPLOYMENT,
      },
      `goblet-app`
    )
  ]
}

module.exports = {
  getDockerLabels,
}
