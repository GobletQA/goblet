/**
 * Used by devspace in the devspace.yml to dynamically load ENV value secrets
 * Allows loading them from pre-configured secrets in the kubernetes cluster
 * **Test run script**:
 * ```
    node -r esbuild-register container/scripts/ds/resolveDSEnvs.js backend docker-auth:user docker-auth:password firebase-sa:firebase-sa
 * ```
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
      optional: ${optional}
      name: ${name}
      ${key ? `key: ${key}` : ``}
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
  let [name, key, optional='false', envKey] = secret.includes(`:`)
    ? secret.trim().split(`:`)
    : [secret, undefined, 'false', undefined]

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
    envName: envKey || (key ? `${cleanStr(name)}_${cleanStr(key)}` : `${cleanStr(name)}`)
  }
}

/**
 * Builds the format for adding a kubernetes secret as an ENV within a container
 */
const buildEnvSecrets = (fromSecrets) => {

  return fromSecrets.reduce((acc, secret) => {
    if(!secret) return acc

    const {
      key,
      name,
      envName,
      optional,
    } = resolveSecretOpts(secret)


    name
      && (acc+= addSecret(
        envName.trim(),
        name.trim(),
        key && key.trim(),
        optional.trim()
      ))

    return acc
  }, ``)
}

module.exports = {
  buildEnvSecrets
}