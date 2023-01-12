import { EBrowserState } from '@types'
import { BrowserButton } from './BrowserButton'
import { BrowserStateIcon } from './Browser.styled'
import { RecordIcon, AlertIcon, colors, gutter } from '@gobletqa/components'

const styles = {
  record: {
    width: `28px`,
    height: `28px`,
  },
  alert: {
    inactive: {
      animation: `unset`,
      width: `16px !important`,
      height: `16px !important`,
      borderLeftColor: `rgba(0, 0, 0, 0.26)`,
    },
    active: {
      width: `16px !important`,
      height: `16px !important`,
    }
  },
  button: {
    color: colors.recordRed,
    marginLeft: gutter.margin.qpx,
    marginRight: gutter.margin.qpx
  }
}

export type TBrowserState = {
  browserState:EBrowserState
  setBrowserState?:(state:EBrowserState) => void
}

export const BrowserState = (props:TBrowserState) => {

  const { browserState } = props
  const stateStyle = browserState === EBrowserState.playing
    ? styles?.alert?.active
    : styles?.alert?.inactive

  return (
    <BrowserButton
      sx={styles.button}
      tooltip={`Browser is ${browserState}`}
      className='goblet-browser-state override-color'
      disabled={Boolean(browserState === EBrowserState.idle)}
    >
      {browserState === EBrowserState.recording
        ? (<RecordIcon sx={styles.record} />)
        : (
            <BrowserStateIcon
              style={stateStyle}
              className='gb-player-glyph gb-player-running'
            />
          )
      }
    </BrowserButton>
  )
}