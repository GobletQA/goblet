
import type { TTerminalTabs, TTerminalTab, TXTermRef } from '@types'

import { useEffect } from 'react'
import { TerminalInput } from './Terminal.styled'

export type TTerminalBody = {
  tabs:TTerminalTabs
  termRef: TXTermRef
  activeTab: TTerminalTab
}

type TTerminalView = {
  active: boolean
  tab:TTerminalTab
  termRef: TXTermRef
}

const TerminalView = (props:TTerminalView) => {
  const { tab, termRef, active } = props


  useEffect(() => {
    if(!termRef?.term) return
    active && termRef?.term?.xterm?.focus()
  }, [active, termRef])

  useEffect(() => {
    if(!termRef?.term || !tab?.history) return

    const xtermHistory = Object.values(termRef?.term?.history)
    // If the store history is less than or equal to xterm, then just return
    if(tab.history.length <= xtermHistory.length)
      return

    const toAdd = tab.history.slice(xtermHistory.length)
    toAdd.length && termRef.term.appendHistory(toAdd)

  }, [tab.history.length])

  return (
    <TerminalInput
      ref={termRef.element}
      className="terminal-input"
      sx={{ display: !active ? `none` : `initial` }}
    />
  )
}

export const TerminalBody = (props:TTerminalBody) => {
  const {
    tabs,
    termRef,
    activeTab
  } = props

  return (
    <>
      {
        tabs.map(tab => {
          return (
            <TerminalView
              tab={tab}
              key={tab.id}
              termRef={termRef}
              active={activeTab === tab}
            />
          )
        })
      }
    </>
  )
}