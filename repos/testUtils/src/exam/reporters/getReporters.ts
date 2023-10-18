import type { TGobletTestOpts } from '@GTU/Types'
import type { TExamReporters, TExamConfig } from '@gobletqa/exam'

import path from 'path'
import { isArr } from '@keg-hub/jsutils'
import { ENVS } from '@gobletqa/environment'

const CliReporterLoc = path.resolve(__dirname, './cli/CliReporter.ts')
const JsonReporterLoc = path.resolve(__dirname, './json/JsonReporter.ts')
const HtmlReporterLoc = path.resolve(__dirname, './html/HtmlReporter.ts')

/**
 * This reporter is always included
 * It handles dispatching events to registered listeners
 * Which is how test traces, and videos are handled 
 */
const EventReporterLoc = path.resolve(__dirname, './event/EventReporter.ts')

export const getReporters = (
  examConfig:Partial<TExamConfig>,
  gobletOpts:TGobletTestOpts
) => {

  const built = isArr(examConfig.reporters)
    ? examConfig.reporters
    : ENVS.GOBLET_RUN_FROM_UI
      ? [
          [JsonReporterLoc, {
            logSplit: ENVS.EXAM_EVENT_LOG_SPLIT_KEY,
          }]
        ]
      : [
          [CliReporterLoc, {}],
          [HtmlReporterLoc, {
            saveReport: gobletOpts.saveReport,
            saveScreenshot: gobletOpts.saveScreenshot,
          }]
        ]

  return ([...built, [EventReporterLoc, {}]]).filter(Boolean) as TExamReporters
}
