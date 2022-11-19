import type { CSSProperties } from 'react'

import 'xterm/css/xterm.css'
import { useTerminal } from '@store'
import { noOpObj } from '@keg-hub/jsutils'
import { TerminalBody } from './TerminalBody'
import { TerminalHeader } from './TerminalHeader'
import { TerminalContainer } from './Terminal.styled'

export type TTerminalProps = {
  sx?:CSSProperties
}

export const Terminal = (props:TTerminalProps) => {
  const { tabs, active } = useTerminal()
  const activeTab = tabs[active] || tabs[0]
  
  return (
    <TerminalContainer
      disableGutters
      sx={props.sx || noOpObj}
      className="terminal-container"
    >
      <TerminalHeader />
      <TerminalBody tab={activeTab} />
    </TerminalContainer>
  )
}