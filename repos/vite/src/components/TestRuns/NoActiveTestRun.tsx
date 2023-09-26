import { PlayCircleOutlineIcon } from '@gobletqa/components'
import { ETestRunsSection } from '@types'
import { TestRunsMsg } from './TestRunsMsg'
import {
  TestRunsButton,
  TestRunsButtonContainer
} from './TestRunsMsg.styled'




export type TNoActiveTestRun = {
  onChangeSection:(section:ETestRunsSection) => void
}

export const NoActiveTestRun = (props:TNoActiveTestRun) => {
  const { onChangeSection } = props

  return (
      <TestRunsMsg
        className='gb-test-run-no-run-active'
        textClass='gb-test-run-no-run-active-text'
        iconClass='gb-test-run-no-run-active-icon'
        message={`No active test run exists?`}
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
  
}