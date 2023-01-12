
import Box from '@mui/material/Box'
import { EBrowserState } from '@types'

const styles = {
  running: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: `absolute`,
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
  const {
    browserState
  } = props

  const style = browserState !== EBrowserState.idle
    ? styles.running
    : styles.idle

  return (
    <Box
      sx={style}
      className='gb-browser-cover'
    />
  )
}