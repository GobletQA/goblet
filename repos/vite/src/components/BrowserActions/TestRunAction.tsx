import type { TBrowserAction, TBrowserActionProps } from '@gobletqa/components'

import { useApp } from '@store'
import { PlayTest } from './PlayAction'
import { RunTestSuite } from './TestSuiteAction'

const TestRun = (props:TBrowserActionProps) => {
  const { testRunsView } = useApp()
  return testRunsView ? (<RunTestSuite {...props} />) : (<PlayTest {...props} />)
}

export const TestRunAction:TBrowserAction = {
  containerSx: {},
  Component: TestRun,
  name: `test-run-action`,
}