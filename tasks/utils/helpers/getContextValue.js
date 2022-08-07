const { getContext } = require('./contexts')

/**
 * Gets an env value based on the passed in context
 * @param {string} context - App context to get the value from
 * @param {Object} envs - Loaded envs from values files
 * @param {string} postFix - the post-fix of the env 
 * @param {*} fallback - Value to return if the env value is not found
 *
 * @returns {*} - Found env value or fallback
 */
const getContextValue = (context, envs, postFix, fallback) => {
  const shortContext = getContext(context)?.short

  return (context && envs[`GB_${context.toUpperCase()}_${postFix}`])
    || (shortContext && envs[`GB_${shortContext.toUpperCase()}_${postFix}`])
    || fallback
}

module.exports = {
  getContextValue
}