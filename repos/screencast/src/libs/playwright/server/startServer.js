const { newServer } = require('./newServer')
const { Logger } = require('@keg-hub/cli-utils')
const { statusServer } = require('./statusServer')
const { get, noOpObj } = require('@keg-hub/jsutils')
const { setServer, getServer } = require('./server')
const { getBrowserType } = require('../helpers/getBrowserType')

/**
 * Starts browser-server using playwright
 * See {@link https://playwright.dev/docs/api/class-browsertype#browser-type-launch-server|Playwright Docs} for more info
 * @function
 * @public
 * @param {Object} browserConf - Config used when launching the browser via playwright
 * @param {Array} browserConf.args - Arguments to pass to the browser on launch
 * @param {string} browserConf.type - Name of the browser to launch
 * @param {string} [browserConf.url=https://google.com] - Initial url the browser should navigate to
 * @param {Object} browserConf.config - Options to pass to the browser on launch
 *
 * @returns {Object} - Contains the page, context, and browser created from playwright
 */
const startServer = async (browserConf = noOpObj, detach=false) => {

  const browser = getBrowserType(browserConf.type)

  const pwServer = getServer()
  const status = await statusServer()
  const sPid = get(status, [browser, `pid`])
  if (sPid) {
    Logger.pair(`- Browser ${browser} server already running with pid:`, sPid)
    // If no playwright server is set, then set it
    !pwServer && setServer(status)
    // Get the most up-to-date server after setting it
    // Should be the same as the status variable
    return getServer()
  }

  // TODO: fix this to run the newServer in a different process
  // This way it can be detached and run in the background
  if(detach){
    newServer(browser, {
      ...browserConf,
      // handleSIGINT: false,
      // handleSIGHUP: false,
      // handleSIGTERM: false,
    })
    return
  }

  return await newServer(browser, browserConf)
}

module.exports = {
  startServer,
}
