import type { TBrowserAction, TBrowserActionProps } from '@gobletqa/components'

import { useApp, useTestRuns } from '@store'
import { PlayTest } from './PlayAction'
import { RunTestSuite } from './TestSuiteAction'

const TestRun = (props:TBrowserActionProps) => {
  const { testRunsView } = useApp()
  const { allTestsRunning } = useTestRuns()

  return (
    <>
      {!testRunsView && (<PlayTest {...props} />)}
      {(testRunsView || allTestsRunning) && (<RunTestSuite {...props} />)}
    </>
  )
}

export const TestRunAction:TBrowserAction = {
  containerSx: {},
  Component: TestRun,
  name: `test-run-action`,
}