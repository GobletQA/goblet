import { EPlayerTestStatus } from '@types'

import {
  TestRunDecoPass,
  TestRunDecoFail,
  TestRunDecoSpin,
  TestRunDecoContainer
} from './TestRunsReporter.styled'


export type TTestRunDeco = {
  status:EPlayerTestStatus|`running`|`loading`
}

const StatusDecoMap = {
  running: TestRunDecoSpin,
  loading: TestRunDecoSpin,
  [EPlayerTestStatus.passed]: TestRunDecoPass,
  [EPlayerTestStatus.failed]: TestRunDecoFail,
}

export const TestRunDeco  = (props:TTestRunDeco) => {
  const { status } = props
  const Component = StatusDecoMap[status]

  return (
    <TestRunDecoContainer>
      {Component && (<Component />) || null}
    </TestRunDecoContainer>
  )
}
