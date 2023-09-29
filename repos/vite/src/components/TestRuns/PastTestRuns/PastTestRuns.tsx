import type { TTestRuns, TTestRun } from '@types'

import { ETestRunsSection } from '@types'
import { PastTestRunList } from './PastTestRunList'
import { TestRunsMsg } from '../TestRunHelpers/TestRunsMsg'
import { PlayCircleOutlineIcon, useInline } from '@gobletqa/components'
import {
  TestRunsButton,
  TestRunsButtonContainer
} from '../TestRunHelpers/TestRunsMsg.styled'


export type TPastTestRuns = {
  runs: TTestRuns
  setRunId:(id:string) => void
  onChangeSection:(section:ETestRunsSection) => void
}

export const PastTestRuns = (props:TPastTestRuns) => {
  const { runs, setRunId, onChangeSection } = props
  const testRuns = Object.values(runs)

  const onClick = useInline((id:string) => {
    setRunId(id)
    onChangeSection(ETestRunsSection.reporter)
  })

  return !testRuns?.length
    ? (
        <TestRunsMsg
          className='gb-test-run-no-past-run'
          textClass='gb-test-run-no-past-run-text'
          iconClass='gb-test-run-no-past-run-icon'
          message={`No previous test runs exist`}
        >
          <TestRunsButtonContainer>
            <TestRunsButton
              text='Run Tests'
              variant='contained'
              Icon={PlayCircleOutlineIcon}
              onClick={() => onChangeSection?.(ETestRunsSection.runOptions)}
            />
          </TestRunsButtonContainer>
        </TestRunsMsg>
      )
    : (
        <PastTestRunList
          runs={testRuns}
          onClick={onClick}
        />
      )
}
