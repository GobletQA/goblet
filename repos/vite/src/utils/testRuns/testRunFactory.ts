import type {
  TTestRun,
  TTestRunId,
  TTestRunStats
} from '@types'
import {deepMerge, emptyObj} from '@keg-hub/jsutils'

const mergeStats = (stats?:TTestRunStats) => deepMerge({
  failed: { features: 0, parents: 0, steps: 0 },
  passed: { features: 0, parents: 0, steps: 0 },
  skipped: { features: 0, parents: 0, steps: 0 },
}, stats)

export const testRunFactory = (
  run:Partial<TTestRun>=emptyObj,
  runId:TTestRunId
):TTestRun => {
  return {
    files:{},
    stats: mergeStats(run?.stats),
    ...run,
    runId
  }
}