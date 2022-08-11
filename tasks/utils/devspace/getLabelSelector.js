const { error } = require('@keg-hub/cli-utils')
const { getLabelContext } = require('../helpers/contexts')

/**
 * Gets the label used to select the a specific container relative to an application
 * @param {Object} params - task action params derived from the passed in options
 *
 * @return {Object} - Found label selector and devspace selector args used to select a container
 */
const getLabelSelector = (params) => {
  const { context, env } = params
  const selector = getLabelContext(context, env)

  !selector && error.throwError(`Could not find selector for context "${context}"`)

  return {
    selector,
    args: [`--label-selector`, selector],
  }
}

module.exports = {
  getLabelSelector,
}

  