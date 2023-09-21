import {
  NoTestRunActiveText,
  NoTestRunActiveContainer,
} from './TestRuns.styled'


export type TNoActiveTestRun = {
  
}

export const NoActiveTestRun = (props:TNoActiveTestRun) => {

  return (
    <NoTestRunActiveContainer>
      <NoTestRunActiveText>
        No active test run found
      </NoTestRunActiveText>
    </NoTestRunActiveContainer>
  )
  
}