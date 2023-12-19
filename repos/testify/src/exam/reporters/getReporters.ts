import type { TGobletTestOpts } from '@GTU/Types'
import type { TExamReporters, TExamConfig, TExReporterCfg } from '@gobletqa/exam'

import path from 'path'
import { ENVS } from '@gobletqa/environment'
import { isArr } from '@keg-hub/jsutils/isArr'
import { checkDistDir } from '@GTU/Utils/checkDistDir'
import { parseJSON } from '@keg-hub/jsutils/parseJSON'
import { artifactSaveOption } from '@GTU/Utils/artifactSaveOption'

const {ext, dirname} = checkDistDir(__dirname, `./exam/reporters`)
const CliReporterLoc = path.resolve(dirname, `./cli/CliReporter.${ext}`)
const JsonReporterLoc = path.resolve(dirname, `./json/JsonReporter.${ext}`)
const HtmlReporterLoc = path.resolve(dirname, `./html/HtmlReporter.${ext}`)

/**
 * This reporter is always included
 * It handles dispatching events to registered listeners
 * Which is how test traces, and videos are handled 
 */
const EventReporterLoc = path.resolve(dirname, `./event/EventReporter.${ext}`)

type TEnvOpts = Record<string, TExReporterCfg|undefined>

/**
 * Parse Reporter options from ENVS when they exist
 */
const parseEnvOpts = ():TEnvOpts => {
  const envOpts:Record<string, TExReporterCfg|undefined> = {}

  if(ENVS.GOBLET_TEST_CLI_REPORTER_OPTS)
    envOpts.cli = parseJSON<TExReporterCfg>(ENVS.GOBLET_TEST_CLI_REPORTER_OPTS, false)

  if(ENVS.GOBLET_TEST_JSON_REPORTER_OPTS)
    envOpts.json = parseJSON<TExReporterCfg>(ENVS.GOBLET_TEST_JSON_REPORTER_OPTS, false)

  if(ENVS.GOBLET_TEST_HTML_REPORTER_OPTS)
    envOpts.html = parseJSON<TExReporterCfg>(ENVS.GOBLET_TEST_HTML_REPORTER_OPTS, false)

  return envOpts
}

export const getReporters = (
  examConfig:Partial<TExamConfig>,
  gobletOpts:TGobletTestOpts
) => {

  const { json, cli, html } = parseEnvOpts()

  const htmlReporterOpts:TExReporterCfg = {
    ...html,
    reportsDir: html?.reportsDir ?? gobletOpts.reportsDir,
    saveReport: artifactSaveOption(html?.saveReport ?? gobletOpts.saveReport),
    saveScreenshot: artifactSaveOption(html?.saveScreenshot ?? gobletOpts.saveScreenshot),
  }

  const jsonReporterOpts:TExReporterCfg = {
    ...json,
    reportsDir: json?.reportsDir ?? gobletOpts.reportsDir,
    logSplit: json?.logSplit ?? ENVS.EXAM_EVENT_LOG_SPLIT_KEY,
  }

  const built = isArr(examConfig.reporters)
    ? examConfig.reporters
    : ENVS.GOBLET_RUN_FROM_UI
      ? [
          [JsonReporterLoc, jsonReporterOpts],
          [HtmlReporterLoc, htmlReporterOpts],
        ]
      : [
          [CliReporterLoc, {...cli}],
          [HtmlReporterLoc, htmlReporterOpts]
        ]

  return ([...built, [EventReporterLoc, {}]]).filter(Boolean) as TExamReporters
}
