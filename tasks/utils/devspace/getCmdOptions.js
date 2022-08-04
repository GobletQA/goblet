const { noOpObj, noPropArr, exists } = require('@keg-hub/jsutils')

/**
 * Extracts the args for the devspace command from the params object
 * @param {Object} params - Passed in options, converted into an object
 *
 * @returns {Array} - Argument array with the devspace options added
 */
const getCmdOptions = (params, flags = noOpObj, values = noPropArr) => {
  return Object.entries(params).reduce((options, [key, value]) => {
    if (flags[key] && value) options.push(flags[key])
    else if (values.includes(key) && exists(value)) options.push(`--${key}`, value)

    return options
  }, [])
}

module.exports = {
  getCmdOptions,
}
