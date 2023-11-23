import type { TTestRunExecEndEvent } from '@types'

import { useState } from 'react'
import { EBrowserState } from '@types'
import { cls } from '@keg-hub/jsutils/cls'
import { useTestRuns, useApp } from '@store'
import { TestRunExecEndEvt } from '@constants'
import { useOnEvent } from '@gobletqa/components'
import { LAutomationCover } from './Layout.styled'
import { LayoutCoverActions } from './LayoutCoverActions'
import { useBrowserState } from '@hooks/screencast/useBrowserState'

export type TLayoutCover = {
  showBrowser?:boolean
}

export const LayoutCover = (props:TLayoutCover) => {

  const {showBrowser} = props

  const { testRunsView } = useApp()
  const {browserState} = useBrowserState()
  const {
    runs,
    active,
    scrollLock,
    allTestsRunning
  } = useTestRuns()

  const htmlReport = active ? runs?.[active].htmlReport : undefined
  const automationActive = ((allTestsRunning && scrollLock) || browserState !== EBrowserState.idle)
  
  const [runReport, setRunReport] = useState<string>()

  useOnEvent<TTestRunExecEndEvent>(TestRunExecEndEvt, ({ runId }) => {
    const run = runs[runId]
    run.htmlReport && setRunReport(run.htmlReport)
  })

  return (
    <>
      <LAutomationCover
        className={cls(
          `gb-automation-cover`,
          automationActive && `active`
        )}
      />
      <LayoutCoverActions
        scrollLock={scrollLock}
        showBrowser={showBrowser}
        testRunsView={testRunsView}
        allTestsRunning={allTestsRunning}
        automationActive={automationActive}
        htmlReport={runReport || htmlReport}
      />
    </>
  )
}
