import {
  TGobletTestOpts,
  TBrowserContext,
  TGobletTestStatus,
  TGobletGlobalBrowserOpts,
  TGobletTestArtifactOption,
} from '@GTU/Types'

import path from 'path'
import { get } from '@keg-hub/jsutils/get'
import { noOpObj } from '@keg-hub/jsutils/noOpObj'
import { ArtifactSaveOpts } from '@gobletqa/browser'
import { appendToLatest } from '@GTU/TestMeta/testMeta'
import { evtReporter } from '@GTU/Exam/reporters/event/EventReporter'
import {
  getGeneratedName,
  copyArtifactToRepo,
  ensureRepoArtifactDir,
} from '@GTU/Playwright/generatedArtifacts'

/**
 * Helper to check is tracing is disabled
 *
 * @returns boolean
 */
const tracingDisabled = () => {
  const tracing = get(global, `__goblet.options.tracing`)
  return Boolean(!tracing || (!tracing.screenshots && !tracing.snapshots))
}

/**
 * Starts tracing on the browser context
 * @param {Object} [context] - Browser context to start tracing on
 *
 * @returns <boolean|void>
 */
export const startTracing = async (context?:TBrowserContext) => {
  if(!context || tracingDisabled()) return

  const traceOpts = get(global, `__goblet.options.tracing`, noOpObj)
  await context.tracing.start(traceOpts)

  return true
}

/**
 * Starts tracing on the browser context
 * @param {Object} [context] - Browser context to start a tracing chunk
 *
 * @returns <boolean|void>
 */
export const startTracingChunk = async (context?:TBrowserContext) => {
  if(!context || context?.__contextGoblet?.tracing || tracingDisabled()) return

  await context.tracing.startChunk()

  context.__contextGoblet = context.__contextGoblet || {}
  context.__contextGoblet.tracing = true

  return true
}


/**
 * Checks if the context was recording a video
 * Then updates the testMeta with the path to the video
 * @param {string} testStatus - `passed` || `failed`
 * @param {string|boolean} saveVideo - one of `never` | `always` | `on-fail` | true | false
 *
 * @returns {boolean} - True if the trace should be saved
 */
const shouldSaveTrace = (
  testStatus:TGobletTestStatus,
  saveTrace:TGobletTestArtifactOption
) => {
  if(!saveTrace || saveTrace === ArtifactSaveOpts.never) return false

  return (saveTrace === ArtifactSaveOpts.always) ||
      (testStatus === ArtifactSaveOpts.failed && saveTrace === ArtifactSaveOpts.failed)
}

/**
 * Starts tracing on the browser context
 * @param {Object} context - Browser context to stop a tracing chunk
 *
 * @returns {Void}
 */
export const stopTracingChunk = async (context?:TBrowserContext) => {
  if(!context || !context?.__contextGoblet?.tracing || tracingDisabled()) return

  const {
    testType,
    saveTrace,
    // Path to the mounted repo where traces should be saved
    tracesDir:repoTracesDir,
  } = get<TGobletTestOpts>(
    global,
    `__goblet.options`,
    noOpObj as TGobletTestOpts
  )

  const {
    name,
    full,
    dir,
    nameTimestamp,
    testPath
  } = getGeneratedName()

  // Get the test result, which contains the passed/failed status of the test
  // If failed, then copy over trace from temp traces dir, to repoTracesDir
  // By default traces will not be saved
  const testResult = evtReporter.getResult(testPath)
  const shouldSave = shouldSaveTrace(testResult?.status, saveTrace)

  if(!shouldSave) return

  const {
    // Path to the temp directory where traces are saved by the browser
    tracesDir,
    type:browser=`browser`
  } = get<TGobletGlobalBrowserOpts>(
    global,
    `__goblet.browser`,
    noOpObj as TGobletGlobalBrowserOpts
  )

  const traceLoc = path.join(tracesDir, `${full}.zip`)
  await context.tracing.stopChunk({ path: traceLoc })

  const saveDir = await ensureRepoArtifactDir(repoTracesDir, dir)
  const savePath = await copyArtifactToRepo(saveDir, nameTimestamp, traceLoc)

  testType &&
    await appendToLatest(`${testType}.traces.${browser}.${name}`, {path: savePath}, true)

  context.__contextGoblet = context.__contextGoblet || {}
  context.__contextGoblet.tracing = false

  return true
}
