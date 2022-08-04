const { exists } = require('@keg-hub/jsutils')

/**
 * Sets envs for all apps the should be included in the command
 * @param {Array} - Deployment names of all apps included in the command being run
 *
 * @return {void}
 */
const setDeploymentEnvs = (deployments, activeMap) => {
  deployments.forEach((deployment) => {
    const env = activeMap[deployment]
    !exists(process.env[env]) && (process.env[env] = deployment)
  })
}

module.exports = {
  setDeploymentEnvs,
}
