import { useTestRuns } from '@store'
import { cls } from '@keg-hub/jsutils'
import { EBrowserState } from '@types'
import { LAutomationCover } from './Layout.styled'
import { useBrowserState } from '@hooks/screencast/useBrowserState'

export const LayoutCover = () => {
  const { allTestsRunning } = useTestRuns()
  const { browserState } = useBrowserState()
  const automationActive = (allTestsRunning || browserState !== EBrowserState.idle)

  return (
    <LAutomationCover
      className={cls(
        `gb-automation-cover`,
        automationActive && `active`
      )}
    />
  )
}
