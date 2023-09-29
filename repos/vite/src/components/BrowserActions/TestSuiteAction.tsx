import type { TTestRunGetUICfgEvt, TTestRunUICfg } from '@types'
import { TBaseActionAction, TBrowserAction, TBrowserActionProps } from '@gobletqa/components'

import { useMemo } from 'react'
import { useTestRuns, useApp } from '@store'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { BrowserStateIcon } from './BrowserActions.styled'
import { runAllTests } from '@actions/testRuns/runAllTests'
import {
  TestSuiteText,
  TestSuiteActionStyles,
  TestSuiteTextContainer,
} from './BrowserActions.styled'
import {
  CancelButtonID,
  WSCancelTestRunEvt,
  TestRunGetUICfgEvt,
} from '@constants'
import {
  BaseAction,
  useThemeType,
  DangerousIcon,
  FolderPlayOutlineIcon,
} from '@gobletqa/components'

const onCancelTestSuite = () => EE.emit(WSCancelTestRunEvt, {})
const onPlayTestSuite = () => EE.emit<TTestRunGetUICfgEvt>(
  TestRunGetUICfgEvt,
  (cfg:TTestRunUICfg) => runAllTests(cfg)
)

export const useTestSuite = (props:TBrowserActionProps) => {
  const { type } = useThemeType()
  const { testRunsView } = useApp()
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
          className: `gb-browser-run-test-suite`,
          tooltip: `Execute multiple or all tests based on the test run options`,
        }
      : {
          as: `button`,
          loc: `bottom`,
          color: `error`,
          variant: `text`,
          id: CancelButtonID,
          containerSx: TestSuiteActionStyles(testRunsView),
          text: (
            <TestSuiteTextContainer>
              <TestSuiteText className='action-text action-normal action-text-normal' >
                Tests Running
              </TestSuiteText>
              <TestSuiteText className='action-text action-hover action-text-hover' >
                Cancel Tests
              </TestSuiteText>
            </TestSuiteTextContainer>
          ),
          onClick: onCancelTestSuite,
          className: `gb-browser-cancel-test-suite`,
          tooltip: `Test suite running; click to cancel`,
          Icon: () =>  (
            <>
              <DangerousIcon className='action-hover gb-test-runs-cancel-icon browser-action' />
              <BrowserStateIcon className='action-normal gb-test-runs-deco-spin browser-action'/>
            </>
          ),
        }
  }, [
    type,
    testRunsView,
    allTestsRunning
  ])

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
