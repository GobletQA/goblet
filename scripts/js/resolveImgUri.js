/**
 * Used by devspace in the devspace.yml to dynamically generate an ingress hosts
 * Should only generate config when a host and sub domain exist
 */
const { resolveValues } = require('./resolveValues')

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
  const image = getEnvValue(values, `GB_${prefix}_IMAGE`)
  const tag = getEnvValue(values, `GB_${prefix}_IMAGE_TAG`)

  process.stdout.write(`${image}:${tag}`)

})()
