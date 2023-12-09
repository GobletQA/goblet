import type { TTestRunGetUICfgEvt, TTestRunUICfg } from '@types'
import { TBaseActionAction, TBrowserAction, TBrowserActionProps } from '@gobletqa/components'

import { useMemo } from 'react'
import { useTestRuns, useApp } from '@store'
import { EE } from '@services/sharedService'
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
  useTheme,
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
  const theme = useTheme()
  const { testRunsView } = useApp()
  const { allTestsRunning } = useTestRuns()

  const actProps = useMemo<TBaseActionAction>(() => {
    return !allTestsRunning
      ? {
          as: `button`,
          onClick: onPlayTestSuite,
          loc: props.loc ?? `bottom`,
          text: props.text ?? `Run Tests`,
          color: props.color ?? `success`,
          variant: props.variant ?? `text`,
          Icon: props.Icon ?? FolderPlayOutlineIcon,
          className: props.className ?? `gb-browser-run-test-suite`,
          tooltip: `Execute multiple or all tests based on the test run options`,
        }
      : {
          as: `button`,
          loc: props.loc ?? `bottom`,
          color: props.color ?? `error`,
          variant: props.variant ?? `text`,
          id: CancelButtonID,
          containerSx: TestSuiteActionStyles(theme, testRunsView),
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
          tooltip: `Test suite running; click to cancel`,
          className: props.className ?? `gb-browser-cancel-test-suite`,
          Icon: () =>  (
            <>
              <DangerousIcon className='action-hover gb-test-runs-cancel-icon browser-action' />
              <BrowserStateIcon className='action-normal gb-test-runs-deco-spin browser-action'/>
            </>
          ),
        }
  }, [
    theme,
    testRunsView,
    allTestsRunning,
    props.loc,
    props.text,
    props.Icon,
    props.color,
    props.variant,
    props.className,
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
