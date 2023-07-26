import type { Exam } from '@GEX/Exam'
import type {
  TExamConfig,
  IExReporter,
  IExamReporter,
  TExReporterCfg,
  TExamReporters,
  TExBuiltReporters,
} from '@GEX/types'

import { DefReportCtx } from '@GEX/constants'
import { isConstructor } from './isConstructor'
import { Reporters } from '@GEX/reporter/Reporters'
import { convertTypeStrToCls } from './convertTypeStrToCls'
import {ensureArr, isArr, isObj, isStr} from '@keg-hub/jsutils'

export type TBuildReporters = {
  exam:Exam,
  config:TExamConfig
  reporters:TExamReporters
}

/**
 * Checks to we should load a Reporter included with Exam defined by a special keyword
 * `default` === `BaseReporter`
 * `silent` === `SilentReporter` 
 * The default config uses the BaseReporter,
 * So that is typically what would be loaded
 */
const checkDefaultReporters = (
  opts:TBuildReporters,
  reporter:TExamReporters<IExamReporter, TExReporterCfg>
) => {
  const [reporterStr, cfg] = isStr(reporter)
    ? [reporter, {}]
    : isArr(reporter)
      ? reporter
      : [undefined, undefined]

  if(!isStr(reporterStr)) return undefined

  const { exam, config } = opts

  const Reporter = Reporters[reporterStr as keyof typeof Reporters]
  return Reporter
    ? new Reporter(config, {...config.reporter, ...cfg, exam}, {...DefReportCtx})
    : undefined
}

/**
 * Builds the reporters into class instances
 * Includes a check for the default included Reporters `default` and `silent`
 * If found, creates a new class instance of it, and returns it in an array
 */
export const buildReporters = async (opts:TBuildReporters):Promise<TExBuiltReporters> => {
  const {
    exam,
    config,
    reporters
  } = opts

  return await Promise.all(
    ensureArr<TExamReporters<IExamReporter, TExReporterCfg>>(reporters)
      .map(async (reporter) => {
        if(!reporter) return

        const FoundReporter = checkDefaultReporters(opts, reporter)
        if(FoundReporter) return FoundReporter

        const [Reporter, cfg] = await convertTypeStrToCls<IExReporter, TExReporterCfg>(
          exam,
          reporter
        )

        return isConstructor<IExReporter>(Reporter)
          ? new Reporter(config, {...config.reporter, ...cfg, exam}, {...DefReportCtx})
          : isObj<IExReporter>(Reporter)
            ? Reporter
            : undefined

      }).filter(Boolean)
  )
}