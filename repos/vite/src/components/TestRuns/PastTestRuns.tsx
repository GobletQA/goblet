import { PlayCircleOutlineIcon } from '@gobletqa/components'
import {useTestRuns} from '@store'
import { TestRunsMsg } from './TestRunsMsg'
import {
  TestRunsButton,
  TestRunsButtonContainer
} from './TestRunsMsg.styled'

import { ETestRunsSection } from '@types'

export type TPastTestRuns = {
  onChangeSection:(section:ETestRunsSection) => void
}


export const PastTestRuns = (props:TPastTestRuns) => {
  const { onChangeSection } = props
  const { runs } = useTestRuns()

  return !runs?.length
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
    : (<>Test Runs</>)
}