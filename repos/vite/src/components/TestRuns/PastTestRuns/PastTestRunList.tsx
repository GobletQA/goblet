import type { TTestRuns, TTestRun } from '@types'

import { ETestRunsSection } from '@types'
import { PastTestRunItem } from './PastTestRunItem'
import { PastTestRunListHeader } from './PastTestRunListHeader'
import { PastTestRunsListItems, PastTestRunsListContainer } from './PastTestRuns.styled'


export type TPastTestRuns = {
  runs: TTestRuns
  setRunId:(id:string) => void
  onChangeSection:(section:ETestRunsSection) => void
}

export type TPastTestRunList = {
  runs: TTestRun[]
  onClick:(id:string) => void
}

export const PastTestRunList = (props:TPastTestRunList) => {
  const {
    runs,
    onClick,
  } = props

  return (
    <PastTestRunsListContainer className='gb-past-test-runs-container' >
      <PastTestRunsListItems className='gb-past-test-runs-list' >
        <PastTestRunListHeader />
        {
          runs.map((run) => {
            return run && (
              <PastTestRunItem
                run={run}
                key={run.runId}
                onClick={onClick}
              />
            ) || null
          })
        }
      </PastTestRunsListItems>
    </PastTestRunsListContainer>
  )
  
}
