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
  const { GB_KUBE_NAMESPACE:ENV_GB_KUBE_NAMESPACE, GB_KUBE_CONTEXT:ENV_GB_KUBE_CONTEXT } = process.env

  !kubeContext &&
  !GB_KUBE_CONTEXT &&
    error.throwError(`The "GB_KUBE_CONTEXT" is required to run devspace commands`)

  const ctx = kubeContext || ENV_GB_KUBE_CONTEXT || GB_KUBE_CONTEXT
  const ns = namespace || ENV_GB_KUBE_NAMESPACE || GB_KUBE_NAMESPACE
  const arrayCtx = [`--namespace`, ns, `--kube-context`, ctx]

  // A bit of a heck, but allows accessing the namespace and context in either an array or object
  arrayCtx.namespace = ns
  arrayCtx.context = ctx

  return arrayCtx
}

module.exports = {
  getDevspaceContext,
}
