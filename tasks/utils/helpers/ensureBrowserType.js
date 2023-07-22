const { exists } = require('@keg-hub/jsutils')
const { FullBrowserNames } = require('@gobletqa/shared/constants')

/**
 * Ensures the browser type is supported
 * @function
 * @private
 * @param {string} browser - Name of the browser to be started
 * @param {Array} allowed - List of allowed browsers
 *
 * @returns {void}
 */
const ensureBrowserType = (browser, allowed = FullBrowserNames) => {
  if (exists(browser) && !allowed.includes(browser))
    throw new Error(
      `The browser ${browser} is not allowed. Must be one of ${allowed.join(
        ' | '
      )}`
    )

  return browser
}

module.exports = {
  ensureBrowserType,
}
