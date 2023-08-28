import { get } from '@keg-hub/jsutils/get'
import { shouldSaveArtifact } from '@gobletqa/browser'
import { evtReporter } from '@GTU/Exam/feature/EventReporter'
import { getGeneratedName, ensureRepoArtifactDir } from '@GTU/Playwright/generatedArtifacts'


/**
 * Checks if a test report should be saved
 * If so copies it from the temp dir to the configured reports path
 *
 * @returns <boolean - True if the report should be saved
 */
export const copyTestReports = async () => {
  const { GOBLET_HTML_REPORTER_OUTPUT_PATH } = process.env
  if(!GOBLET_HTML_REPORTER_OUTPUT_PATH) return

  const { testPath } = getGeneratedName()
  const testResult = evtReporter.getResult(testPath)
  const reportSaved = shouldSaveArtifact(
    get(global, `__goblet.options.saveReport`),
    testResult?.status
  )

  if(!reportSaved) return

  const reportSplit = GOBLET_HTML_REPORTER_OUTPUT_PATH.split(`/`)
  reportSplit.pop()
  const reportLoc = reportSplit.join(`/`)
  const reportTempPath = get(global, `__goblet.paths.reportTempPath`)

  // If the temp report path is the same as the ENV output path, then just return
  reportTempPath !== GOBLET_HTML_REPORTER_OUTPUT_PATH
    && await ensureRepoArtifactDir(reportLoc)

}
