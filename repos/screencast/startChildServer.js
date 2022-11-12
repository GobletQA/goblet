require('./resolveRoot')

const { ChildBrowserServerKey } = require('./src/constants')
const { newServer } = require('./src/libs/playwright/server/newServer')

/**
 * Runs the browser server via a forked sub-process
 * Expects the second argument to be the value of ChildBrowserServerKey
 */
const startServerFromChild = async () => {
  const [
    __child,
    browser,
    browserConfStr
  ] = process.argv.slice(2)

  const browserConf = JSON.parse(browserConfStr)
  await newServer(browser, browserConf)
}

process.argv[2] === ChildBrowserServerKey
  && startServerFromChild()