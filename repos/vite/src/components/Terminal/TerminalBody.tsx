
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
  termRef: TXTermRef
}

const TerminalView = (props:TTerminalView) => {
  const { termRef, active } = props

  useEffect(() => {
    if(!termRef?.term) return
    active && termRef.term.xterm.focus()
  }, [active, termRef])

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