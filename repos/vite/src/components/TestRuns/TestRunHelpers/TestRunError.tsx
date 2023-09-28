import {TTestRun} from '@types'
import {useMemo} from 'react'
import {
  TestRunErrorText,
  TestRunErrorIcon,
  TestRunErrorStack,
  TestRunErrorContainer,
  TestRunErrorHeaderText,
  TestRunErrorTextContainer,
  TestRunErrorHeaderContainer,
  TestRunErrorContentContainer,
} from './TestRunError.styled'


export type TTestRunError = {
  run:TTestRun
}

const useTestRunError = (run:TTestRun) => {
  const { runError } = run
  
  return useMemo(() => {
    const message = run?.runError?.description
      || run?.runError?.text
      || `An error was thrown trying to execute the test suite`

    const [msg, ...stack] = message.split(`\n`)

    return {msg, stack: stack}

  }, [runError])
}

export const TestRunError = (props:TTestRunError) => {
  const { run } = props
  const {msg, stack} = useTestRunError(run)

  return (
    <TestRunErrorContainer className='gb-test-run-error' >
      <TestRunErrorContentContainer className='gb-test-run-error-content' >

        <TestRunErrorHeaderContainer className='gb-test-run-error-header' >
          <TestRunErrorIcon className='gb-test-run-error-header-icon' />
          <TestRunErrorHeaderText className='gb-test-run-error-header-text' >
            Error running Test Suite
          </TestRunErrorHeaderText>
        </TestRunErrorHeaderContainer>

        <TestRunErrorTextContainer className='gb-test-run-error-text' >
          <TestRunErrorText className='gb-test-run-error-text-msg' >
            {msg}
          </TestRunErrorText>
          {stack?.map((line => {
            return (
              <TestRunErrorStack key={line} className='gb-test-run-error-text-stack' >
                {line}
              </TestRunErrorStack>
            )
          }))}
        </TestRunErrorTextContainer>

      </TestRunErrorContentContainer>
    </TestRunErrorContainer>
  )
  
}