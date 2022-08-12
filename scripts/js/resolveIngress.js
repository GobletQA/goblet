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
  if(!prefix) return

  const values = resolveValues()

  const subDomain = getEnvValue(values, `GB_${prefix}_SUB_DOMAIN`)
    || getEnvValue(values, `GB_SUB_DOMAIN`)

  const hostDomain = getEnvValue(values, `GB_${prefix}_HOST_DOMAIN`)
    || getEnvValue(values, `GB_HOST_DOMAIN`)
    || `local.gobletqa.app`

  const deployment = getEnvValue(values, `GB_${prefix}_DEPLOYMENT`)

  /**
   * Build the ingress host based on the host and sub domains
   */
  const ingressHost = subDomain
    ? `${subDomain}.${hostDomain}`
    : `${deployment.replace('_', '-')}.${hostDomain}`

  process.stdout.write(ingressHost)

})()
