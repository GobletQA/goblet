import type { TTestRuns } from '@types'

import { useCallback } from 'react'
import { ETestRunsSection } from '@types'
import { PastTestRunList } from './PastTestRunList'
import { TestRunSectionScroll } from '../TestRuns.styled'
import { TestRunsMsg } from '../TestRunHelpers/TestRunsMsg'
import { PlayCircleOutlineIcon } from '@gobletqa/components'
import {
  TestRunsButton,
  TestRunsButtonContainer
} from '../TestRunHelpers/TestRunsMsg.styled'


export type TPastTestRuns = {
  runs: TTestRuns
  allTestsRunning?:boolean
  setRunId:(id:string) => void
  onChangeSection:(section:ETestRunsSection) => void
}

export const PastTestRuns = (props:TPastTestRuns) => {
  const { runs, setRunId, onChangeSection } = props
  const testRuns = Object.values(runs)

  const onClick = useCallback((id:string) => {
    setRunId(id)
    onChangeSection(ETestRunsSection.reporter)
  }, [setRunId, onChangeSection])

  return (
    <TestRunSectionScroll>
      {
        !testRuns?.length
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
    </TestRunSectionScroll>
  )

}
