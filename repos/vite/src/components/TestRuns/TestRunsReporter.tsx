import {useTestRuns} from "@store"
import { TestRunEvents } from './TestRunEvents'
import { NoActiveTestRun } from './NoActiveTestRun'
import { TestRunReporterContainer } from './TestRuns.styled'

export type TTestRunsReporter = {}

export const TestRunsReporter = (props:TTestRunsReporter) => {
  const { runs, active } = useTestRuns()

  return (
    <TestRunReporterContainer>
      {
        !active
          ? (<NoActiveTestRun />)
          : (<TestRunEvents name={active} events={runs[active]} />)
      }
    </TestRunReporterContainer>
  )
  
}