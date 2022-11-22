import type { TTerminalTabs, TXTermIdMap } from '@types'
import type { MutableRefObject, SyntheticEvent } from 'react'

import { useCallback } from 'react'
import { terminalDispatch } from '@store'
import { TerminalTabs } from './TerminalTabs'

export type TerminalHeader = {
  active:number
  tabs:TTerminalTabs
  terminals: MutableRefObject<TXTermIdMap>
}

export const TerminalHeader = (props:TerminalHeader) => {

  const { active, tabs, terminals } = props

  const onChange = useCallback((evt:SyntheticEvent, value:`+`|number) => {
    value === `+`
      ? terminalDispatch.create({})
      : terminalDispatch.setActive(value)

  }, [active, tabs])

  const onClose = useCallback((evt:SyntheticEvent, tabId:string) => {
    evt?.preventDefault()
    evt?.stopPropagation()

    terminals?.current?.[tabId]?.remove?.()
    terminalDispatch.remove(tabId)

  }, [active, tabs, terminals])

  return (
    <>
      <TerminalTabs
        tabs={tabs}
        active={active}
        onTabClose={onClose}
        onTabChange={onChange}
        className='terminal-header-tabs'
        TabIndicatorProps={{ children: <span className="MuiTabs-indicator" /> }}
      />
    </>
  )
}