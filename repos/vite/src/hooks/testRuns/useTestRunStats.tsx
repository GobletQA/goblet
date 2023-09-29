import type { TTestRun } from "@types"

import {useMemo} from "react"
import {useTestRuns} from "@store"
import { calculateTestRunStats } from '@utils/testRuns/calculateTestRunStats'

export type THTestRunStats = {
  run:TTestRun
}

const stat = { features: 0, parents: 0, steps: 0 }


export const useTestRunStats = (props:THTestRunStats) => {
  const { run } = props
  const testRuns = useTestRuns()

  return useMemo(() => {
    const hasStats = Boolean(testRuns.allTestsRunning && run?.stats)
      || Boolean(run?.stats?.passed && run?.stats?.failed && run?.stats?.skipped)

    return hasStats ? run?.stats : calculateTestRunStats(run)

  }, [
    run.stats,
    testRuns.allTestsRunning
  ])
}
