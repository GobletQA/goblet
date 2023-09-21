import {useTestRuns} from "@store"
import { TestRunEvents } from './TestRunEvents'
import { NoActiveTestRun } from './NoActiveTestRun'
import { TestRunReporterContainer } from './TestRuns.styled'

export type TTestRunsReporter = {}

export const TestRunsReporter = (props:TTestRunsReporter) => {
  const { runs, active } = useTestRuns()

  if(active){
    console.log(runs[active])
  }

  return null

  // return (
  //   <TestRunReporterContainer>
  //     {
  //       !active
  //         ? (<NoActiveTestRun />)
  //         : (<TestRunEvents name={active} events={runs[active]} />)
  //     }
  //   </TestRunReporterContainer>
  // )
  
}