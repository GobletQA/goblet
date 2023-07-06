import { Logger } from '@keg-hub/cli-utils'
import { copyTestReports } from '@GTU/Playwright/testReport'
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
  Logger.stderr(`\n[Goblet] Playwright Initialize Error\n`)
  err && Logger.stderr(`\n${err.stack}\n`)
  setTimeout(() => process.exit(1), 500)
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
    await cleanup()
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
export const cleanup = async () => {
  if (!global.browser){
    await commitTestMeta()
    return false
  }

  // Wrap in try catch and properly exit if there's an error
  // TODO: need to figure out the proper exit code for non-test errors
  // This way we can know it not a test that failed
  try {
    await stopTracingChunk(global.context)

    // Await the close of the context due to video recording
    global?.context && await global?.context?.close()

    await saveRecordingPath(getLastActivePage())
    setLastActivePage(undefined)
  
    global.browser && await global.browser.close()

    await copyTestReports()
    await commitTestMeta()

    delete global.browser
    delete global.context
    delete global.page

    return true
  }
  catch(err){
    forceExit(err)
  }
}
