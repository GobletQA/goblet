import type { TTestRunEvtStatus } from '@types'

import {CSSProperties} from 'react'
import {cls} from '@keg-hub/jsutils'
import { EResultStatus } from '@ltipton/parkin'

import {
  TestRunDecoPass,
  TestRunDecoFail,
  TestRunDecoSpin,
  TestRunDecoCanceled,
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
  canceled: TestRunDecoCanceled,
  [EResultStatus.passed]: TestRunDecoPass,
  [EResultStatus.failed]: TestRunDecoFail,
}

export const TestRunDeco  = (props:TTestRunDeco) => {
  const { sx, className, status } = props
  const Component = StatusDecoMap[status as keyof typeof StatusDecoMap]
  const iconClass = status === `running` ? `gb-test-runs-deco-spin` : ``

  return (
    <TestRunDecoContainer
      sx={sx}
      className={cls(
        status,
        className,
        `gb-test-runs-deco-container`
      )}
    >
      {Component && (<Component iconClass={iconClass} />) || null}
    </TestRunDecoContainer>
  )
}
