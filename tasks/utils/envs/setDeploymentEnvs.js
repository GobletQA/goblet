const { exists } = require('@keg-hub/jsutils')
const { getDeploymentOpts } = require('../helpers/contexts')

/**
 * Sets envs for all apps the should be included in the command
 * @param {string} env - The current env to load the deployments values for
 * @param {Array<string} [deployArr] - Collection of deployments that should be included
 *
 * @return {void}
 */
const setDeploymentEnvs = (env, deployArr) => {
  const deployOpts = getDeploymentOpts(env)
  const { activeMap } = deployOpts

  ;(deployArr || deployOpts.deployArr).forEach((deployment) => {
    const env = activeMap[deployment]
    !exists(process.env[env]) && (process.env[env] = deployment)
  })
}

module.exports = {
  setDeploymentEnvs,
}
