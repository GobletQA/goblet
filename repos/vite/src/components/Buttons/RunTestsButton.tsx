import {
  TestRunsBtn,
  TestRunsIcon,
  TestRunsText
} from './RunTestsButton.styled'
import { toggleTestRunsView } from '@actions/testRuns/toggleTestRunsView'

export const RunExamButton = () => {
  return (
    <TestRunsBtn
      Icon={TestRunsIcon}
      onClick={() => toggleTestRunsView()}
      text={(
        <TestRunsText>
          Run Test Suite
        </TestRunsText>
      )}
    />
  )
}