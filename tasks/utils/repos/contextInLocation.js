const { exists, ensureArr } = require('@keg-hub/jsutils')

/**
 * Checks if the passed in context matches the passed in location
 * @param {string|Array<string>} [context] - Name or names of repo to check
 * @param {string} [location] - Path to the current repo checked
 * @param {string} [match] - String compare against instead of location
 *
 * @return {boolean} - True if the yarn command should be run
 */
const contextInLocation = (context, location, match) => {
  if (!exists(context) || context === 'all') return true

  const filter = ensureArr(context)
  match = match || location.split('/').slice(-2).join('/').toLowerCase()

  return filter.some(
    (item) => item === location || match.toLowerCase().includes(item.toLowerCase())
  )
}

module.exports = {
  contextInLocation,
}
