import type { TBaseActionAction, TBrowserAction, TBrowserActionProps } from '@gobletqa/components'

import { TTestRunGetUICfgEvt, TTestRunUICfg } from '@types'
import { useMemo } from 'react'
import { useTestRuns } from '@store'
import { DangerousIcon } from '@gobletqa/components'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { runAllTests } from '@actions/testRuns/runAllTests'
import { BaseAction, FolderPlayOutlineIcon } from '@gobletqa/components'
import {
  CancelButtonID,
  WSCancelTestRunEvt,
  TestRunGetUICfgEvt,
} from '@constants'

const onCancelTestSuite = () => EE.emit(WSCancelTestRunEvt, {})
const onPlayTestSuite = () => EE.emit<TTestRunGetUICfgEvt>(
  TestRunGetUICfgEvt,
  (cfg:TTestRunUICfg) => runAllTests(cfg)
)

export const useTestSuite = (props:TBrowserActionProps) => {
  const { allTestsRunning } = useTestRuns()

  const actProps = useMemo<TBaseActionAction>(() => {
    return !allTestsRunning
      ? {
          as: `button`,
          loc: `bottom`,
          variant: `text`,
          color: `success`,
          text: `Run Tests`,
          onClick: onPlayTestSuite,
          Icon: FolderPlayOutlineIcon,
          className: `goblet-browser-run-tests`,
          tooltip: `Execute multiple or all tests based on the test configuration`,
        }
      : {
          as: `button`,
          loc: `bottom`,
          color: `error`,
          text: `Cancel`,
          variant: `text`,
          id: CancelButtonID,
          Icon: DangerousIcon,
          onClick: onCancelTestSuite,
          tooltip: `Cancel tests execution`,
          className: `goblet-browser-cancel-recording`,
        }
  }, [allTestsRunning])

  return {
    actProps
  }
}

export const RunTestSuite = (props:TBrowserActionProps) => {
  const { actProps } = useTestSuite(props)

  return (<BaseAction {...actProps} />)
}

export const TestSuiteAction:TBrowserAction = {
  containerSx: {},
  Component: RunTestSuite,
  name: `run-test-suite-action`,
}
