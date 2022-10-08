/**
 * Used by devspace to generate the image pull policy for the passed in service
 * To Test node scripts/js/resolvePullPolicy.js BE
 */
const { resolveValues, getEnvPrefix } = require('./resolveValues')
const ePreFix = getEnvPrefix()

/**
 * Gets the value to use when generating the ingress hosts from the process or values file
 * @param {Object} values - ENVs loaded from the values file
 * @param {string} key - ENV name to get the value of
 *
 * @returns {string|undefined} - found value or undefined
 */
const getEnvValue = (values, key) => {
  return process.env[key] || values[key]
}

;(async () => {
  const prefix = process.argv.slice(2).shift()
  const values = resolveValues()

  const pullPolicy = getEnvValue(values, `${ePreFix}${prefix}_PULL_POLICY`)
    || getEnvValue(values, `${ePreFix}IMAGE_PULL_POLICY`)
    || getEnvValue(values, `IMAGE_PULL_POLICY`)
    || `Always`

  process.stdout.write(pullPolicy)

})()
