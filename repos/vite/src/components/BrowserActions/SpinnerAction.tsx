import type { TBrowserAction, TBrowserActionProps } from '@gobletqa/components'

import { EBrowserState } from '@types'
import { colors, gutter } from '@gobletqa/components'
import { BrowserStateIcon } from './BrowserActions.styled'
import { BrowserButton } from '@components/Browser/BrowserButton'
import { useBrowserState } from '@hooks/screencast/useBrowserState'

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


export const BrowserSpinner = (props:TBrowserActionProps) => {
  
  const { browserState } = useBrowserState()
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
      <BrowserStateIcon
        style={stateStyle}
        className='gb-player-glyph gb-player-running'
      />
    </BrowserButton>
  )
}

export const SpinnerAction:TBrowserAction = {
  Component: BrowserSpinner,
  name: `spinner-browser-action`,
  containerSx: {},
}