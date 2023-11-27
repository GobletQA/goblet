import type { TTestRunExecEndEvent } from '@types'

import { EBrowserState } from '@types'
import { cls } from '@keg-hub/jsutils/cls'
import { useTestRuns, useApp } from '@store'
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
        htmlReport={htmlReport}
        showBrowser={showBrowser}
        testRunsView={testRunsView}
        allTestsRunning={allTestsRunning}
        automationActive={automationActive}
      />
    </>
  )
}
