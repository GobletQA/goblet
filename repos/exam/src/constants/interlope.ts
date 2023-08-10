import type { TEXInterReporterContext } from '@GEX/types'
import {noOp} from '@keg-hub/jsutils/noOp'

export const DefReportCtx:TEXInterReporterContext = {
  firstRun: true,
  previousSuccess: true,
  changedFiles: undefined, // Set<string>
  sourcesRelatedToTestsInChangedFiles: undefined, // Set<string>
  startRun: noOp, // (config: TExamConfig) => unknown
}

export const globalConfigMap = {
  
}