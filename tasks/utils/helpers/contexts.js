const { isArr } = require('@keg-hub/jsutils')

/**
 * Cache holder for the app contexts
 */
let __CONTEXTS__ = {}

/**
 * Sets the contexts that can be used durning task execution
 * @param {Object} contexts - Contexts object with defined app contexts
 */
const setContexts = (contexts) => {
  __CONTEXTS__ = isArr(contexts)
    ? contexts.reduce((acc, keys) => {
        const long = keys[0]
        const short = keys[keys.length - 1]
        // Both short and log ref the same object
        acc[short] = { keys, short, long }
        acc[long] = acc[short]

        return acc
      }, {})
    : contexts
}

/**
 * Returns a context based on the passed in name
 * @returns {Object} context - Found context object
 */
const getContext = (name) => __CONTEXTS__[name]

/**
 * Returns the contexts previously set by the setContexts helper
 * @returns {Object} contexts - Contexts object with defined app contexts
 */
const getContexts = () => __CONTEXTS__

module.exports = {
  getContext,
  getContexts,
  setContexts,
}