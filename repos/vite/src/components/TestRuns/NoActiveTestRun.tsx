import {
  NoTestRunActiveIcon,
  NoTestRunActiveText,
  NoTestRunActiveContainer,
} from './TestRuns.styled'


export type TNoActiveTestRun = {
  
}

export const NoActiveTestRun = (props:TNoActiveTestRun) => {

  return (
    <NoTestRunActiveContainer className='gb-test-run-no-run-active' >
      <NoTestRunActiveIcon />
      <NoTestRunActiveText className='gb-test-run-no-run-active-text' >
        No active test run found?
      </NoTestRunActiveText>
    </NoTestRunActiveContainer>
  )
  
}