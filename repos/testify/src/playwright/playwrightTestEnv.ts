import type { TGobletTestOpts } from '@gobletqa/shared/types'
import type {
  TBrowser,
  TBrowserContext,
} from '@GTU/Types'

import { Logger } from '@gobletqa/logger'
import { limbo } from '@keg-hub/jsutils/limbo'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'
import {
  getPage,
  closePage,
  closePages,
  setupBrowser,
} from '@GTU/Playwright/browserContext'

/**
 * Helper to force exit the process after 1/2 second
 */
const forceExit = (err?:Error, isCleanup?:boolean) => {
  !isCleanup
    ? Logger.stderr(`\n${Logger.colors.red(`[Goblet Init Error]`)} Playwright could not be initialized\n`)
    : Logger.stderr(`\n${Logger.colors.red(`[Goblet Cleanup Error]`)} Playwright could not be shutdown, attempting force close.\n`)

  err && Logger.stderr(`\n${err.stack}\n`)

  setTimeout(() => {
    process.exit(1)
  }, 500)
}

/**
 * Force shut down everything because of an initialization error
 * Includes shutting down the browser
 */
const initErrCloseAll = async () => {

  await limbo(closePage(undefined, 3))
  global.page = undefined

  global.context && await limbo(global.context.close())
  global.context = undefined

  global.browser && await limbo(global.browser.close())
  global.browser = undefined

  delete global.browser
  delete global.context
  delete global.page
}

/**
 * Shutdown the page and context if not configured to be reused per test
 * Browser is not shutdown in this method so it can be reused in other tests
 */
export const cleanupPageAndContext = async (force?:boolean, allPages?:boolean) => {

  const {
    reusePage,
    reuseContext,
  } = global?.__goblet?.options ?? emptyObj

  if(!reusePage || force){
    allPages
      ? await limbo(closePages())
      : await limbo(closePage(undefined, 3))

    global.page = undefined
    delete global.page
  }

  /**
   * Don't call closeContext method because it throws an error when the context can't be found
   * Instead we manually close the context and remove it from the global scope
   */
  if(!reuseContext || force){
    global.context && await limbo(global?.context?.close?.())
    global.context = undefined
    delete global.context
  }

}

/**
 * Creates a new browser and context
 * Adds both browser and context to the global scope
 *
 * @return <boolean> - true if init was successful
 */
export const initialize = async () => {
  let startError:boolean
  let browser:TBrowser
  let context:TBrowserContext

  try {
    const resp = await setupBrowser()
    browser = resp.browser
    context = resp.context
  }
  catch (err) {
    startError = true
    await limbo(cleanup(true))
    forceExit(err)
  }
  finally {
    if(startError) return {}

    const page = await getPage()

    return {
      page,
      browser,
      context,
    }
  }
}

/**
 * Cleans up for testing tear down by releasing all resources, including
 * the browser window and any globals set in `initialize`.
 *
 */
export const cleanup = async (initErr?:boolean) => {

  if (!global.browser){
    await cleanupPageAndContext(true)
    return false
  }

  try {

    initErr
      ? await initErrCloseAll()
      : await cleanupPageAndContext(true)

    return true
  }
  catch(err){
    forceExit(err, !initErr)
  }

}
