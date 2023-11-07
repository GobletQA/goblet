import { useTestRuns } from '@store'
import { cls } from '@keg-hub/jsutils'
import { EBrowserState } from '@types'
import { LAutomationCover } from './Layout.styled'
import { useBrowserState } from '@hooks/screencast/useBrowserState'
import { TestRunToggleScroll } from "@components/TestRuns/TestReporter/TestRunToggleScroll"

      

export const LayoutCover = () => {
  const {
    scrollLock,
    allTestsRunning
  } = useTestRuns()
  const { browserState } = useBrowserState()
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
    </>
  )
}
