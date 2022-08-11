const { error } = require('@keg-hub/cli-utils')
const { setDeploymentEnvs } = require('../envs/setDeploymentEnvs')
const { exists, isStr, noOpArr, isArr } = require('@keg-hub/jsutils')
const { getDeployContext, getDeploymentOpts } = require('../helpers/contexts')

/**
 * Gets all allowed apps to deploy relative to the skip array
 * @param {Array<string>|string} skip - List of apps that should not run for the command
 * @param {Object} envs - All envs parsed from the value files for the current environment
 *
 * @return {Array} - All allow apps that can be deployed
 */
const getAllowedDeployments = (skipArr, deployArr, env) => {
  const shouldSkip = skipArr.reduce((acc, app) => {
    const deployment = getDeployContext(app, env)

    deployment && acc.push(deployment)

    return acc
  }, [])

  // Filter out any apps that are not allowed to deploy
  const allowedDeploys = deployArr.filter(
    (deployment) => !shouldSkip.includes(deployment)
  )

  // Ensure there are allow apps, otherwise throw
  return allowedDeploys.length
    ? allowedDeploys
    : error.throwError(`At least 1 deployment must be allowed to run this task`)
}

/**
 * Gets all passed in apps that match an app context
 * @param {Array<string>|string} context - List of apps that should run for the command
 * @param {Array<string>|string} skip - List of apps that should not run for the command
 * @param {string} env - The current environment the command is running in
 *
 * @return {string} - Context converted into a string of app deployments
 */
const getDeployments = (context, skip, env) => {
  const { deployArr } = getDeploymentOpts(env)

  // If no context and no skip, return undefined to deploy all
  if (!exists(context) && !exists(skip)) return setDeploymentEnvs(env)

  // Ensure skip and context are both arrays
  const skipArr = isArr(skip) ? skip : isStr(skip) ? skip.split(`,`) : noOpArr
  const contextArr = isArr(context)
    ? context
    : isStr(context)
      ? context.split(`,`)
      : noOpArr

  // If no context and no skip, return undefined to deploy all
  if (!contextArr.length && !skipArr.length) setDeploymentEnvs(env)

  // Get the array of apps that are allowed to be deployed
  const allowedDeploys = skipArr.length
    ? getAllowedDeployments(skipArr, deployArr, env)
    : deployArr

  // If no context is defined, return all allowed deploys
  if (!contextArr.length) {
    setDeploymentEnvs(env, allowedDeploys)

    return allowedDeploys.join(',')
  }

  // Loop over the context deployments, and compare with the allowed
  // If it's in the allowed array, the add it to the accumulator
  const deployments = contextArr.reduce((acc, app) => {
    const deployment = getDeployContext(app, env)

    // Ensure it's in the allow array, and add it to the accumulator
    allowedDeploys.includes(deployment) && acc.push(deployment)

    return acc
  }, [])

  // Ensure there are apps to deploy, otherwise throw
  !deployments.length &&
    error.throwError(`At least 1 deployment must be allowed to run this task`)

  setDeploymentEnvs(env, deployments)

  return deployments.join(',')
}

module.exports = {
  getDeployments,
}
