import type { TTestRun, TTestRunEvtStatus } from "@types"

import { useMemo } from "react"
import {EResultStatus} from "@ltipton/parkin"
import { toNum, wordCaps } from "@keg-hub/jsutils"
import { TestRunFileRootEvtRef } from '@constants'
import { getEventStatus } from '@utils/testRuns/getEventStatus'

export type THPastTestRuns = {
  run:TTestRun
}

const getTestRunStatus = (run:TTestRun) => {
  if(run.status) return run.status
  if(run.canceled) return `canceled`
  if(run.runError) return EResultStatus.failed
  
  return Object.entries(run.files)
    .reduce((status, [loc, file]) => {
      return status !== `passed`
        ? status as TTestRunEvtStatus
        : getEventStatus(file?.events[TestRunFileRootEvtRef])
    }, `passed` as TTestRunEvtStatus)
  
}

export const usePastTestRun = (props:THPastTestRuns) => {
  const { run } = props

  return useMemo(() => {
    const [name, timestamp] = run.runId.split(`.`)
    const date = new Date()
    date.setTime(toNum(timestamp) * 1000)

    return {
      date,
      name: wordCaps(name),
      htmlReport: run.htmlReport,
      status: getTestRunStatus(run)
    }
  }, [
    run
  ])

}

