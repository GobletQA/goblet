import type { TGobletTestOpts } from '@gobletqa/shared/types'

import { get } from '@keg-hub/jsutils/get'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'
import { copyTestReports } from '@GTU/Playwright/testReport'
import { Logger } from '@gobletqa/shared/libs/logger/cliLogger'
import { saveRecordingPath } from '@GTU/Playwright/videoRecording'
import { initTestMeta, commitTestMeta } from '@GTU/TestMeta/testMeta'
import { stopTracingChunk, startTracingChunk } from '@GTU/Playwright/tracing'
import {
  setupContext,
  setupBrowser,
  setLastActivePage,
  getLastActivePage,
} from '@GTU/Playwright/browserContext'

/**
 * Helper to force exit the process after 1/2 second
 */
const forceExit = (err?:Error) => {
  Logger.stderr(`\n${Logger.colors.red(`[Goblet Init Error]`)} Playwright could not be initialized\n`)
  err && Logger.stderr(`\n${err.stack}\n`)
  setTimeout(() => process.exit(1), 500)
}

/**
 * Force shut down everything because of an initialization error
 * Includes shutting down the browser
 */
const initErrCloseAll = async () => {
  try { global.browser && await global.browser.close() }
  catch(err){}
  global.browser = undefined

  try { global.context && await global.context.close() }
  catch(err){}
  global.context = undefined
  
  try { global.page && await global.page.close() }
  catch(err){}
  global.page = undefined

  delete global.browser
  delete global.context
  delete global.page
}

/**
 * Shutdown the page and context if not configured to be reused per test
 * Browser is not shutdown in this method so it can be reused in other tests
 * Browser shutdown is done in the Jasmine Reporter at `testUtils/src/reports/jasmineReporter.ts`
 * Jest doesn't have an onFinished hook, so seems like the only place it can be done
 */
const cleanupPageAndContext = async () => {

  const {
    reusePage,
    reuseContext,
  } = get<TGobletTestOpts>(global, `__goblet.options`, emptyObj)

  if(!reusePage){
    global.page && await global?.page?.close?.()
    global.page = undefined
    delete global.page
  }

  if(!reuseContext){
    global.context && await global?.context?.close?.()
    global.context = undefined
    delete global.context
  }

}

/**
 * Helper to wrap a cleanup method in a try catch and log any errors that are thrown
 */
const tryLogCleanupCB = async (cb:(...args:any[]) => any, message:string) => {
  try {
    return await cb()
  }
  catch(err){
    Logger.stderr(`${Logger.colors.red(`[Goblet Cleanup Error]`)} ${message}`)
    err && Logger.stderr(`\n${err.stack}\n`)
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

  try {
    await initTestMeta()
    await setupBrowser()
    await setupContext()
  }
  catch (err) {
    startError = true
    await cleanup(true)
    forceExit(err)
  }
  finally {
    return !startError &&
      await startTracingChunk(global.context)
  }
}

/**
 * Cleans up for testing tear down by releasing all resources, including
 * the browser window and any globals set in `initialize`.
 *
 */
export const cleanup = async (initErr?:boolean) => {

  if (!global.browser){
    await commitTestMeta()
    return false
  }

  await tryLogCleanupCB(
    async () => await stopTracingChunk(global.context),
    `Failed attempt to stop Tracing...`,
  )

  await tryLogCleanupCB(
    async () => await saveRecordingPath(getLastActivePage()),
    `Failed attempt to save Recording...`,
  )

  await tryLogCleanupCB(
    copyTestReports,
    `Failed attempt to save Test Reports...`,
  )

  await tryLogCleanupCB(
    commitTestMeta,
    `Failed attempt to commit test meta...`,
  )

  try {
    setLastActivePage(undefined)

    initErr
      ? await initErrCloseAll()
      : await cleanupPageAndContext()

    return true
  }
  catch(err){
    forceExit(err)
  }

}
