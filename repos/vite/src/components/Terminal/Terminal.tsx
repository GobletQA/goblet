import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import { useTerminal } from '@hooks/services/useTerminal'
import 'xterm/css/xterm.css'

export type TTerminalProps = {
  
}

export const Terminal = (props:TTerminalProps) => {
  const [terminal, termRef] = useTerminal()

  return (
    <Container className="terminal-container" disableGutters sx={{ backgroundColor: `#111111` }} >
      <Box
        ref={termRef}
        className="terminal"
        sx={{ height: '100%' }}
      />
    </Container>
  )
}