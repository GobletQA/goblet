/**
 * URI of the image to be used for the passed in service
 * Test node container/scripts/ds/resolveImgUri.js BE
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
  const image = getEnvValue(values, `${ePreFix}${prefix}_IMAGE`)
  const tag = getEnvValue(values, `${ePreFix}${prefix}_IMAGE_TAG`)

  process.stdout.write(`${image}:${tag}`)

})()
