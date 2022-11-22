import type { CSSProperties } from 'react'

import 'xterm/css/xterm.css'
import { useTerminal } from '@store'
import { TerminalBody } from './TerminalBody'
import { TerminalHeader } from './TerminalHeader'
import { TerminalContainer } from './Terminal.styled'
import { useXTerminal } from '@hooks/terminal/useXTerminal'
import { useTerminalResize } from '@hooks/terminal/useTerminalResize'


export type TTerminalProps = {
  sx?:CSSProperties
}

export const Terminal = (props:TTerminalProps) => {
  const { tabs, active } = useTerminal()
  const activeTab = tabs[active] || tabs[0]
  const [termRef, terminals] = useXTerminal(activeTab)

  useTerminalResize({ terminals })

  return (
    <TerminalContainer
      sx={props.sx}
      disableGutters
      className="terminal-container"
    >
      <TerminalHeader terminals={terminals} tabs={tabs} active={active} />
      <TerminalBody termRef={termRef} activeTab={activeTab} tabs={tabs} />
    </TerminalContainer>
  )
}