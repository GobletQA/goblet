/**
 * Used by devspace in the devspace.yml to dynamically load values
 * Allows loading them from the container/values*.yaml based on NODE_ENV
 * Run command below to test
 * `node scripts/js/resolveDSEnvs.js certs provider-auth:api-key:LINODE_V4_API_KEY`
 */
const { exists } = require('@keg-hub/jsutils') 
const { resolveValues, resolveConfig } = require('./resolveValues')

const { apps } = resolveConfig()

/**
 * Builds formatted yaml string for converting envs into the correct format
 */
const addEnv = (name, value) => (`
- name: ${name}
  value: ${value}
`.trimStart()
)

const addArg = (name, value) => (`\n${name}=${value}`)

/**
 * Checks if the passed in item has a * in it
 * Then uses the * to check if parts of the item exist in the key
 */
const findFilterMatch = (key, item) => {
  if(key === item) return true
  if((!item && key) || (!key && item)) return false

  if(!item.includes(`*`)) return false

  const parts = item.split(`*`)
  const end = (parts.pop() || ``).trim()
  const start = (parts.shift() || ``).trim()
  
  return (start && key.startsWith(start))
    || (end && key.endsWith(end))
}

/**
 * Builds the passed in envs that exist in the passed in pickList and omitList
 */
const buildEnvs = (envs, pickList=[], omitList=[]) => {
  const hasPick = Boolean(pickList.length)
  const hasOmit = Boolean(omitList.length)

  return Object.entries(envs)
    .reduce((acc, [key, value]) => {
      const val = process.env[key] ?? value
      if(!exists(val) || val === "") return acc

      const shouldOmit = hasOmit && omitList.find(item => findFilterMatch(key, item))
      const shouldPick = hasPick && pickList.find(item => findFilterMatch(key, item))

      // Add if there's a pick list and env should be picked
      // And explicitly in the pick list or NOT explicitly in the omit list
      // Covers edge case for ENVs from * pattern that are explicitly omitted
      if (hasPick)
        shouldPick
          && (pickList.includes(key) || !omitList.includes(key))
          && (acc[key] = val)

      // Add if omit list exists and there's no pick list OR it should be picked
      else if(hasOmit)
        !shouldOmit
          && (!hasPick || shouldPick)
          && (acc[key] = val)


      // Add if no omit list and no pick list exist
      else
        acc[key] = val

      return acc
    }, {})
}


const convertToYaml = (envs) => {
  return Object.entries(envs)
    .reduce((acc, [key, value]) => `${acc}${addEnv(key, '"'+ value +'"')}`, ``)
}

const convertToArgs = (envs) => {
  return Object.entries(envs)
    .reduce((acc, [key, value]) => (value ? `${acc.trimEnd()}\n${key}=${value}` : acc), ``)
    .trimEnd()
}


/**
 * Builds the list to pick and omit envs based on the passed in repo
 */
const buildLists = (repo) => {
  return {
    omitList: [
      ...(apps?._all?.envs?.omit ?? []),
      ...(apps?.[repo]?.envs?.omit ?? []),
    ],
    pickList: [
      ...(apps?._all?.envs?.pick ?? []),
      ...(apps?.[repo]?.envs?.pick ?? []),
    ]
  }
}

/**
 * Filters an Envs object passed to it
 * Returns the filtered envs as an object. **NOT** yaml
 * @param {string} repo - Name of the repos to filter the envs for
 * @param {Object} existingEnvs - Envs object to be filtered
 *
 * @returns {Object} - Filtered envs Object
 */
const filterExistingEnvs = (repo, existingEnvs) => {
  const { pickList, omitList } = buildLists(repo)
  return buildEnvs(existingEnvs, pickList, omitList)
}

/**
 * Filters an Envs loaded from the values files
 * Then formats them as a yaml string
 * @param {string} repo - Name of the repos to filter the envs for
 *
 * @returns {string} - Filtered and formatted yaml string of the Envs
 */
const filterEnvsAsYaml = (repo) => {
  const { pickList, omitList } = buildLists(repo)
  const envs = resolveValues()
  const built = buildEnvs(envs, pickList, omitList)

  return convertToYaml(built)
}

const filterEnvsAsArgs = (repo) => {
  const { pickList, omitList } = buildLists(repo)
  const envs = resolveValues()
  const built = buildEnvs(envs, pickList, omitList)

  return convertToArgs(built)
}

module.exports = {
  addArg,
  addEnv,
  filterEnvsAsYaml,
  filterEnvsAsArgs,
  filterExistingEnvs
}