import type { TTestRunExecEndEvent, TGobletSettings } from '@types'

import { useState } from 'react'
import { cls } from '@keg-hub/jsutils'
import { EBrowserState } from '@types'
import { useTestRuns, useApp } from '@store'
import { TestRunExecEndEvt } from '@constants'
import { DownloadIcon } from '@gobletqa/components'
import { downloadReport } from '@actions/files/api/downloadReport'
import { useBrowserState } from '@hooks/screencast/useBrowserState'
import { useSettingValues } from '@hooks/settings/useSettingValues'
import { RunTestSuite } from '@components/BrowserActions/TestSuiteAction'
import { TestRunToggleScroll } from "@components/TestRuns/TestReporter/TestRunToggleScroll"
import {
  TestRunDownload,
  LAutomationCover,
  TestRunsActionContainer,
  TestRunsDownloadContainer,
} from './Layout.styled'
import {
  useOnEvent,
} from '@gobletqa/components'

export const LayoutCover = () => {
  const {
    runs,
    active,
    scrollLock,
    allTestsRunning
  } = useTestRuns()
  const { testRunsView } = useApp()
  const { browserState } = useBrowserState()
  const { browserInBrowser } = useSettingValues<TGobletSettings>(`goblet`)
  const automationActive = ((allTestsRunning && scrollLock) || browserState !== EBrowserState.idle)
  const [htmlReport, setHtmlReport] = useState(active ? runs?.[active].htmlReport : undefined)

  useOnEvent<TTestRunExecEndEvent>(TestRunExecEndEvt, ({ runId }) => {
    const run = runs[runId]
    run.htmlReport && setHtmlReport(run.htmlReport)
  })

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
        <>
          {htmlReport && (
            <TestRunsDownloadContainer>
              <TestRunDownload
                tooltip='Download test run html report'
                Icon={DownloadIcon}
                text='Download Report'
                onClick={(evt:any) => {
                  evt.preventDefault()
                  evt.stopPropagation()
                  downloadReport(htmlReport)
                }}
              />
            </TestRunsDownloadContainer>
          ) || null}
          <TestRunsActionContainer>
            <RunTestSuite variant={`contained`} />
          </TestRunsActionContainer>
        </>
      ) || null}
    </>
  )
}
