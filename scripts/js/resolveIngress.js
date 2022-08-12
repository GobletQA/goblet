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

/**
 * Builds the ingress host from the prefix relative to a deployment
 * i.e. goblet-backend.local.goblet.app
 */
const buildHost = (prefix, values) => {
  const subDomain = getEnvValue(values, `GB_${prefix}_SUB_DOMAIN`)
    || getEnvValue(values, `GB_SUB_DOMAIN`)

  const hostDomain = getEnvValue(values, `GB_${prefix}_HOST_DOMAIN`)
    || getEnvValue(values, `GB_HOST_DOMAIN`)
    || `local.gobletqa.app`

  const deployment = getEnvValue(values, `GB_${prefix}_DEPLOYMENT`).replace(/_/g, `-`).split(`-`).pop()

  /**
   * Build the ingress host based on the host and sub domains
   */
  return subDomain
    ? `${subDomain}.${hostDomain}`
    : `${deployment}.${hostDomain}`
}

;(async () => {

  const [prefix, subdomains] = process.argv.slice(2)
  if(!prefix) return

  const values = resolveValues()
  /**
   * Build the ingress host based on the host and sub domains
   */
  const ingressHost = buildHost(prefix, values)

  subdomains && subdomains.length
    ? process.stdout.write(`${subdomains}.${ingressHost}`)
    : process.stdout.write(ingressHost)

})()
