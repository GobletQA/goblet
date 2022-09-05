/**
 * Used by devspace in the devspace.yml to dynamically load ENV value secrets
 * Allows loading them from pre-configured secrets in the kubernetes cluster
 */
const { isStrBool } = require('@keg-hub/jsutils') 

/**
 * Builds formatted yaml string for converting a secret to an ENV
 * For use as an ENV key name
 */
const addSecret = (envName, name, key, optional) => (`
- name: ${envName}
  valueFrom:
    secretKeyRef:
      name: ${name}
      key: ${key}
      optional: ${optional}
`)

/**
 * Formats the passed in string to only have valid chars
 * For use as an ENV key name
 */
const cleanStr = (str) => {
  return str.replace(/\s|\.|-/g, `_`)
    .replace(/[^a-zA-Z ]+[^a-zA-Z0-9_]/g, ``)
    .toUpperCase()
}

/**
 * Resolves the options for building a secret as an ENV
 * Passed in secret uses the format <name>:<key>:<options ? ENV-NAME>:<ENV-NAME>
 * If no envName, then use the name and key to create it
 */
const resolveSecretOpts = secret => {
  let [name, key, optional='false', envKey] = secret.trim().split(`:`)

  // Check if envKey is set as third option
  // If it is, set envKey to optional value, and default optional to false
  if(!envKey && !isStrBool(optional)){
    envKey = optional
    optional = 'false'
  }

  return {
    key,
    name,
    optional,
    envName: envKey || `${cleanStr(name)}_${cleanStr(key)}`
  }
}

/**
 * Builds the format for adding a kubernetes secret as an ENV within a container
 */
const buildEnvSecrets = (fromSecrets) => {
  return fromSecrets.reduce((acc, secret) => {
    if(!secret) return acc

    const resolved = resolveSecretOpts(secret)

    const {
      key,
      name,
      envName,
      optional,
    } = resolved

    name && key
      && (acc+= addSecret(
        envName.trim(),
        name.trim(),
        key.trim(),
        optional.trim()
      ))

    return acc
  }, ``)
}

module.exports = {
  buildEnvSecrets
}