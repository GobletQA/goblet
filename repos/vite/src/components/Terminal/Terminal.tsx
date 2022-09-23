import type { CSSProperties } from 'react'

import Box from '@mui/material/Box'
import { noOpObj } from '@keg-hub/jsutils'
import Container from '@mui/material/Container'
import { useTerminal } from '@hooks/services/useTerminal'
import 'xterm/css/xterm.css'

export type TTerminalProps = {
  sx?:CSSProperties
  tSx?:CSSProperties
}

export const Terminal = (props:TTerminalProps) => {
  const [terminal, termRef] = useTerminal()

  return (
    <Container
      disableGutters
      className="terminal-container"
      sx={[{
        display: `flex`,
        minHeight: `100%`,
        alignItems: `stretch`,
        backgroundColor: `#111111`,
      }, props.sx || noOpObj]}
    >
      <Box
        ref={termRef}
        className="terminal-element"
        sx={[{ width: '100%' }, props.tSx || noOpObj]}
      />
    </Container>
  )
}