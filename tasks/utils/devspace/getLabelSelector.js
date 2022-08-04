const { loadEnvs } = require('../envs/loadEnvs')
const { resolveContext } = require('../kubectl/resolveContext')

/**
 * Gets the label used to select the a specific container relative to an application
 * @param {Object} params - task action params derived from the passed in options
 *
 * @return {Object} - Found label selector and devspace selector args used to select a container
 */
const getLabelSelector = (params) => {
  const { context, env } = params

  const envs = loadEnvs({ env })
  const selector = resolveContext(context, {
    be: `app.kubernetes.io/component=${envs.GB_BE_DEPLOYMENT}`,
    fe: `app.kubernetes.io/component=${envs.GB_FE_DEPLOYMENT}`,
    sc: `app.kubernetes.io/component=${envs.GB_SC_DEPLOYMENT}`,
    cd: `app.kubernetes.io/component=${envs.GB_CD_DEPLOYMENT}`,
    db: `app.kubernetes.io/component=${envs.GB_DB_DEPLOYMENT}`,
    px: `app.kubernetes.io/component=${envs.GB_PX_DEPLOYMENT}`,
  })

  return {
    selector,
    args: [`--label-selector`, selector],
  }
}

module.exports = {
  getLabelSelector,
}
