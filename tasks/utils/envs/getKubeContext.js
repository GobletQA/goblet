const { loadEnvs } = require('./loadEnvs')
const { error } = require('@keg-hub/cli-utils')

/**
 * Gets the kubernetes context to use for kubernetes commands
 * If not set in the ENV, the throws an error
 * @param {Object} params - Passed in options, converted into an object
 *
 * @returns {string} - Value to use for the kubernetes context
 */
const getKubeContext = (params) => {
  const { kubeContext, env } = params

  if (kubeContext) return kubeContext
  else if (process.env.GB_KUBE_CONTEXT) return process.env.GB_KUBE_CONTEXT

  const { GB_KUBE_CONTEXT } = loadEnvs({ env })

  return (
    GB_KUBE_CONTEXT ||
    error.throwError(`The "GB_KUBE_CONTEXT" is required to run devspace commands`)
  )
}

module.exports = {
  getKubeContext,
}
