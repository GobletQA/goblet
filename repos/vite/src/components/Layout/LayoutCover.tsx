import type { TGobletSettings } from '@types'
import { useTestRuns, useApp } from '@store'
import { cls } from '@keg-hub/jsutils'
import { EBrowserState } from '@types'
import { useBrowserState } from '@hooks/screencast/useBrowserState'
import { useSettingValues } from '@hooks/settings/useSettingValues'
import { RunTestSuite } from '@components/BrowserActions/TestSuiteAction'
import { TestRunToggleScroll } from "@components/TestRuns/TestReporter/TestRunToggleScroll"
import {
  LAutomationCover,
  TestRunsActionContainer,
} from './Layout.styled'

export const LayoutCover = () => {
  const {
    scrollLock,
    allTestsRunning
  } = useTestRuns()
  const { testRunsView } = useApp()
  const { browserState } = useBrowserState()
  const { browserInBrowser } = useSettingValues<TGobletSettings>(`goblet`)
  const automationActive = ((allTestsRunning && scrollLock) || browserState !== EBrowserState.idle)

  return (
    <>
      <LAutomationCover
        className={cls(
          `gb-automation-cover`,
          automationActive && `active`
        )}
      >
      </LAutomationCover>
      {allTestsRunning && (<TestRunToggleScroll scrollLock={scrollLock} />)}
      {testRunsView && !browserInBrowser && (
        <TestRunsActionContainer>
          <RunTestSuite variant={`contained`} />
        </TestRunsActionContainer>
      ) || null}
    </>
  )
}
