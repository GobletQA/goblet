const { getContexts } = require('../helpers/contexts')
const { noOpObj, exists } = require('@keg-hub/jsutils')

/**
 * Resolves the context used to reference a kubernetes resource
 * Also checks if the context is an alias of the app or db, and returns the corresponding selector
 * @param {string} context - Passed in context option from params object
 * @param {Object} selectors - Key Value pair of selectors for each resource
 * @param {*} fallback - Fallback value to use is no context match is found
 *
 * @return {string} - Selector for referencing a kubernetes resource
 */
const resolveContext = (context = ``, selectors = noOpObj, fallback) => {
  const lowercaseContext = context.toLowerCase()
  const allContexts = getContexts()

  const found = Object.entries(allContexts)
    .reduce((found, [ref, value]) => {
      const { keys, long, short } = allContexts[ref]
      
      return !found && keys.includes(lowercaseContext)
        ? selectors[short] || selectors[long]
        : found

    }, false)

  return found || (exists(fallback) ? fallback : context)
}

module.exports = {
  resolveContext,
}
