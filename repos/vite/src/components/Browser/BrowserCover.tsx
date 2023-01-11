import type { TPlayerResEvent } from '@types'

import { useState } from 'react'
import Box from '@mui/material/Box'
import { useEventListen } from '@hooks/useEvent'
import { PlayerStartedEvent, PlayerEndedEvent } from '@constants'

const styles = {
  running: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: `absolute`,
  },
  stopped: {
    display: `none`
  }
}

export const BrowserCover = () => {
  const [running, setRunning] = useState<boolean>(false)

  useEventListen(PlayerStartedEvent, (event:TPlayerResEvent) => setRunning(true))
  useEventListen(PlayerEndedEvent, (event:TPlayerResEvent) => setRunning(false))

  const style = running ? styles.running : styles.stopped

  return (
    <Box
      sx={style}
      className='gb-browser-cover'
    />
  )
}