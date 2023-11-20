import { toggleTestRunsView } from '@actions/testRuns/toggleTestRunsView'

import {
  TestRunsHeaderText,
  TestRunsCancelButton,
  TestRunsHeaderActions,
  TestRunsHeaderContainer,
  TestRunsCancelButtonIcon
} from '../TestRuns.styled'

export type TTestRunsHeader = {}

export const TestRunsHeader = (props:TTestRunsHeader) => {
  return (
    <TestRunsHeaderContainer className='gb-test-run-header' >
      <TestRunsHeaderText>
        Test Suite
      </TestRunsHeaderText>
      <TestRunsHeaderActions>
        <TestRunsCancelButton
          color='error'
          Icon={TestRunsCancelButtonIcon}
          onClick={() => toggleTestRunsView(false)}
        />
      </TestRunsHeaderActions>
    </TestRunsHeaderContainer>
  )
  
}