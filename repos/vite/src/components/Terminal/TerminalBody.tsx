import type { CSSProperties } from 'react'
import type { TTerminalTab } from '@types'

import Box from '@mui/material/Box'
import { noOpObj } from '@keg-hub/jsutils'
import { TerminalInput } from './Terminal.styled'
import { useXTerminal } from '@hooks/services/useXTerminal'

export type TTerminalBodyProps = {
  sx?:CSSProperties
  tab: TTerminalTab
}

export const TerminalBody = (props:TTerminalBodyProps) => {
  const {
    tab,
    sx=noOpObj,
  } = props
  
  const [terminal, termRef] = useXTerminal()

  return (
    <TerminalInput
      sx={sx}
      ref={termRef}
      className="terminal-component"
    />
  )
}