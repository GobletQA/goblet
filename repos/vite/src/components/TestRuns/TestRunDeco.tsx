import {cls} from '@keg-hub/jsutils'
import { TTestRunEvtStatus, EPlayerTestStatus } from '@types'
import {CSSProperties} from 'react'

import {
  TestRunDecoPass,
  TestRunDecoFail,
  TestRunDecoSpin,
  TestRunDecoContainer
} from './TestRunsReporter.styled'


export type TTestRunDeco = {
  className?:string
  sx?:CSSProperties
  status:TTestRunEvtStatus
}

const StatusDecoMap = {
  // TODO: add a loading Deco component
  loading: undefined,
  running: TestRunDecoSpin,
  [EPlayerTestStatus.passed]: TestRunDecoPass,
  [EPlayerTestStatus.failed]: TestRunDecoFail,
}

export const TestRunDeco  = (props:TTestRunDeco) => {
  const { sx, className, status } = props
  const Component = StatusDecoMap[status as keyof typeof StatusDecoMap]

  return (
    <TestRunDecoContainer
      sx={sx}
      className={cls(
        status,
        className,
        `gb-test-runs-deco-container`
      )}
    >
      {Component && (<Component />) || null}
    </TestRunDecoContainer>
  )
}
