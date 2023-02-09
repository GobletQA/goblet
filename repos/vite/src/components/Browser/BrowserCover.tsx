
import Box from '@mui/material/Box'
import { EBrowserState } from '@types'

const styles = {
  playing: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: `absolute`,
  },
  recording: {
    display: `none`
  },
  idle: {
    display: `none`
  }
}

export type TBrowserCover = {
  browserState:EBrowserState
  setBrowserState?:(state:EBrowserState) => void
}

export const BrowserCover = (props:TBrowserCover) => {
  const { browserState } = props

  return (
    <Box
      sx={styles[browserState]}
      className='gb-browser-cover'
    />
  )
}