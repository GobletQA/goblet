import type { SyntheticEvent } from 'react'

import { useCallback } from 'react'
import { useTerminal } from '@store'
import { terminalDispatch } from '@store'
import { TerminalTabs } from './TerminalTabs'

export type TerminalHeader = {}

export const TerminalHeader = (props:TerminalHeader) => {

  const { tabs, active } = useTerminal()
  const activeTab = tabs[active] || tabs[0]


  const onChange = useCallback((evt:SyntheticEvent, value:`+`|number) => {
    value === `+`
      ? terminalDispatch.create({})
      : terminalDispatch.setActive(value)

  }, [active, tabs])

  const onClose = useCallback((evt:SyntheticEvent, tabId:string) => {
    evt?.preventDefault()
    evt?.stopPropagation()

    terminalDispatch.remove(tabId)

  }, [active, tabs])

  return (
    <>
      <TerminalTabs
        tabs={tabs}
        active={active}
        onTabClose={onClose}
        onTabChange={onChange}
        TabIndicatorProps={{ children: <span className="MuiTabs-indicator" /> }}
      />
    </>
  )
}