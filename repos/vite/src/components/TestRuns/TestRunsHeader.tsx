import { useTestRuns } from "@store"
import { toggleTestRunsView } from '@actions/testRuns/toggleTestRunsView'

import {
  TestRunsHeaderText,
  TestRunsCancelButton,
  TestRunsHeaderContainer,
  TestRunsCancelButtonIcon
} from './TestRuns.styled'


import { CloseIcon } from '@gobletqa/components'


export type TTestRunsHeader = {
  
}

export const TestRunsHeader = (props:TTestRunsHeader) => {
  const { allTestsRunning } = useTestRuns()
  
  return (
    <TestRunsHeaderContainer className='gb-test-run-header' >
      <TestRunsHeaderText>
        Test Suite
      </TestRunsHeaderText>
      {!allTestsRunning && (
        <TestRunsCancelButton
          color='error'
          Icon={TestRunsCancelButtonIcon}
          onClick={() => toggleTestRunsView(false)}
        />
      ) || null}
    </TestRunsHeaderContainer>
  )
  
}