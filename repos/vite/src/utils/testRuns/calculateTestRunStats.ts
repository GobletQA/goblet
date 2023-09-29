import type { TTestRun, TTestRunEvent, TTestRunStats } from "@types"

import { ETREvtType } from "@types"
import { getStore } from '@store'
import {exists} from "@keg-hub/jsutils"
import { getTREventType } from "./getTREventType"
import {updateTestRunStats} from "./updateTestRunStats"


export type THTestRunStats = {
  run:TTestRun
}

const stat = { features: 0, parents: 0, steps: 0 }


const addSkipped = (
  stats:TTestRunStats,
  event:TTestRunEvent
) => {
  switch(getTREventType(event)){
    case ETREvtType.feature: {
      stats.skipped.features = stats.skipped.features + 1
      break
    }
    case ETREvtType.parent: {
      stats.skipped.parents = stats.skipped.parents + 1
      break
    }
    case ETREvtType.step: {
      stats.skipped.steps = stats.skipped.steps + 1
      break
    }
  }
}

const ensureTRStats = (run:TTestRun) => {
  return {
    ...run,
    files: {...run.files},
    stats: {
      failed: {...stat},
      passed: {...stat},
      skipped: {...stat},
      ...(run.stats as Partial<TTestRunStats>),
    }
  }
}


export const calculateTestRunStats = (run:TTestRun, allTestsRunning?:boolean) => {
  const testRun = ensureTRStats(run)

  const calcSkipped = exists(allTestsRunning)
    ? !allTestsRunning
    : !getStore().getState?.()?.testRuns?.allTestsRunning

  return Object.entries(run.files)
    .reduce((acc, [loc, file]) => {
      file.events
        && Object.entries(file.events)
          .forEach(([id, evtStages]) => {
            const { start, end } = evtStages

            if(end) {
              updateTestRunStats(testRun, end)
              acc = testRun.stats
            }
            else if(start && calcSkipped) addSkipped(acc, start)

          })

      return acc
    }, testRun.stats)

}
