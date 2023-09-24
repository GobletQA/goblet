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
  
  return (
    <TestRunsHeaderContainer className='gb-test-run-header' >
      <TestRunsHeaderText>
        Test Suite
      </TestRunsHeaderText>
      <TestRunsCancelButton
        color='error'
        Icon={TestRunsCancelButtonIcon}
        onClick={() => toggleTestRunsView(false)}
      />
    </TestRunsHeaderContainer>
  )
  
}