const { error } = require('@keg-hub/cli-utils')
const { noOpObj } = require('@keg-hub/jsutils')
const { loadEnvs } = require('../envs/loadEnvs')

/**
 * Runs devspace use command passing in the configured namespace and kube-context
 * @param {Object} params - Passed in task options, converted into an object
 *
 * @returns {Promise<Array<string>>} - Array containing namespace and kube-context arguments
 */
const getDevspaceContext = (params = noOpObj) => {
  const { namespace, kubeContext, env } = params
  const { GB_KUBE_NAMESPACE = `gb-local`, GB_KUBE_CONTEXT } = loadEnvs({ env })

  !GB_KUBE_CONTEXT &&
    error.throwError(`The "GB_KUBE_CONTEXT" is required to run devspace commands`)

  return [
    `--namespace`,
    namespace || GB_KUBE_NAMESPACE,
    `--kube-context`,
    kubeContext || GB_KUBE_CONTEXT,
  ]
}

module.exports = {
  getDevspaceContext,
}
