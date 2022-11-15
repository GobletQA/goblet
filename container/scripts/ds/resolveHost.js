/**
 * Used by devspace in the devspace.yml to dynamically generate an ingress hosts
 * Should only generate config when a host and sub domain exist
 */
const { resolveValues, resolveHost } = require('./resolveValues')

;(async () => {

  const [prefix, subdomains] = process.argv.slice(2)
  if(!prefix) return

  const values = resolveValues()
  /**
   * Build the ingress host based on the host and sub domains
   */
  const Host = resolveHost(prefix, values)

  subdomains && subdomains.length
    ? process.stdout.write(`${subdomains}.${Host}`)
    : process.stdout.write(Host)

})()
