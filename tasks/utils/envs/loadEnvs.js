const { appRoot } = require('../../paths')
const { noPropArr } = require('@keg-hub/jsutils')
const { addToProcess } = require('@keg-hub/cli-utils')
const { loadConfigs } = require('@keg-hub/parse-config')


/**
 * Internal env cache to speed up task execution
 * @type {Object}
 */
const __CACHED_ENVS = {}

/**
 * Loads the envs from the `values` files based on passed in`env`
 * Caches response based on env and search locations
 * @param {string} env - Current env to use when searching for values files
 * @param {Array<string>} locations - Extra locations to search for values files
 * @param {string} name - Name of app included in the name of searched for values files
 * @param {boolean} cache - Should the env cache be used
 *
 * @return {Object} - Loaded envs based on passed in arguments
 */
const loadEnvs = (
  env = process.env.NODE_ENV,
  locations = noPropArr,
  name = 'goblet',
  cache = true
) => {
  // Check if the envs were already loaded and use the cach if it exsts
  const cacheKey = `${env}-${locations.sort().join('-')}`
  if (cache && __CACHED_ENVS[cacheKey]) return __CACHED_ENVS[cacheKey]

  const mergedEnvs = loadConfigs({
    env,
    name,
    locations: [appRoot, ...locations],
  })

  // Add the loaded envs to the current process.env
  addToProcess(mergedEnvs)

  // Cache the envs to speed up future calls
  __CACHED_ENVS[cacheKey] = mergedEnvs

  return mergedEnvs
}

module.exports = {
  loadEnvs,
}
