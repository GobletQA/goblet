const { devspace } = require('./devspace')
const { noOpObj } = require('@keg-hub/jsutils')
const { loadEnvs } = require('../envs/loadEnvs')
const { resolveContext } = require('../kubectl/resolveContext')

/**
 * Runs the devspace logs command, passing in the context as the --image-selector
 * @param {Object} params - Passed in options, converted into an object
 *
 * @returns {Promise<*>} - Response from the devspace command
 */
const devspaceLogs = async (params = noOpObj) => {
  const { context, env, follow } = params

  const cmdArgs = [`logs`]
  follow && cmdArgs.push(`--follow`)

  const envs = loadEnvs(env)
  const selector = resolveContext(context, {
    be: `app.kubernetes.io/component=${envs.GB_BE_DEPLOYMENT}`,
    fe: `app.kubernetes.io/component=${envs.GB_FE_DEPLOYMENT}`,
    sc: `app.kubernetes.io/component=${envs.GB_SC_DEPLOYMENT}`,
    cd: `app.kubernetes.io/component=${envs.GB_CD_DEPLOYMENT}`,
    db: `app.kubernetes.io/component=${envs.GB_DB_DEPLOYMENT}`,
    px: `app.kubernetes.io/component=${envs.GB_PX_DEPLOYMENT}`,
  })

  selector && cmdArgs.push(`--label-selector`, selector)

  return await devspace(cmdArgs, params)
}

module.exports = {
  devspaceLogs,
}
