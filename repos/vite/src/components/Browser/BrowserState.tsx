import { EBrowserState } from '@types'
import { capitalize } from '@keg-hub/jsutils'
import { BrowserButton } from './BrowserButton'
import { RecordIcon, AlertIcon, colors, gutter } from '@gobletqa/components'

const styles = {
  record: {
    width: `28px`,
    height: `28px`,
  },
  alert: {
    width: `18px`,
    height: `18px`,
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

  return (
    <BrowserButton
      sx={styles.button}
      className='goblet-browser-state override-color'
      tooltip={`Browser ${capitalize(browserState)}`}
      disabled={Boolean(browserState === EBrowserState.idle)}
    >
      {browserState === EBrowserState.recording
        ? (<RecordIcon sx={styles.record} />)
        : (<AlertIcon sx={styles.alert} />)
      }
    </BrowserButton>
  )
  
}