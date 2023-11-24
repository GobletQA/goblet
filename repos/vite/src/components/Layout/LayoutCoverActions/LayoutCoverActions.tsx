import { RunTestsAction } from './RunTestsAction'
import { ToggleScrollAction } from './ToggleScrollAction'
import { ReportDownloadAction } from './ReportDownloadAction'

import { LayoutCoverActionsContainer } from './LayoutCoverActions.styled'

export type TLayoutCoverActions = {
  htmlReport?:string
  scrollLock?:boolean
  showBrowser?:boolean
  testRunsView?:boolean
  allTestsRunning?:boolean
  automationActive?:boolean
}


export const LayoutCoverActions = (props:TLayoutCoverActions) => {
  const {
    htmlReport,
    scrollLock,
    showBrowser,
    testRunsView,
    allTestsRunning
  } = props

  return testRunsView && (
    <LayoutCoverActionsContainer className='layout-cover-actions-container' >
      {allTestsRunning ? (<ToggleScrollAction scrollLock={scrollLock} />) : null}
      {htmlReport ? (<ReportDownloadAction htmlReport={htmlReport} />) : null}
      {!showBrowser ? (<RunTestsAction />) : null}
    </LayoutCoverActionsContainer>
  ) || null
  
}