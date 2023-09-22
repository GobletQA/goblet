import { EPlayerTestStatus } from '@types'


import {
  TestRunDecoPass,
  TestRunDecoFail,
  TestRunDecoSpin,
  TestRunDecoContainer
} from './TestRunEvents.styled'


export type TTestRunDeco = {
  status:EPlayerTestStatus|`running`|`loading`
}

export const TestRunDeco  = (props:TTestRunDeco) => {
  const { status } = props
  
  return (
    <TestRunDecoContainer>
      {
        status === EPlayerTestStatus.passed
          ? (<TestRunDecoPass />)
          : status === EPlayerTestStatus.failed
            ? (<TestRunDecoFail />)
          : status === `running` || status === `loading`
            ? (<TestRunDecoSpin />)
            : null
      }
    </TestRunDecoContainer>
  )
}
